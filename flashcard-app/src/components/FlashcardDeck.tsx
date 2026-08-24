import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Volume2,
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  BookOpen,
  Info,
  Filter,
  Image as ImageIcon
} from 'lucide-react';
import { Card, Database, UserProgress, MasteryStatus, Gender } from '../types';
import { sound, speakGerman } from '../utils/sound';
import { updateCardMastery, toggleStarCard } from '../utils/storage';
import { PictogramIcon } from './PictogramIcon';
import { filterCardsByTopic } from '../utils/topic';

interface FlashcardDeckProps {
  database: Database;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  onViewPoster?: (posterId: string, seriesId: string) => void;
  seriesId: string;
  posterId: string;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  database,
  progress,
  setProgress,
  onViewPoster,
  seriesId,
  posterId,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMastery, setSelectedMastery] = useState<string>('all');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showRule, setShowRule] = useState<boolean>(false);

  const filteredCards = useMemo(() => {
    let list = filterCardsByTopic(database.cards, seriesId, posterId);

    if (selectedType !== 'all') {
      list = list.filter((c) => c.type === selectedType);
    }
    if (selectedMastery === 'starred') {
      list = list.filter((c) => progress.starredCardIds.includes(c.id));
    } else if (selectedMastery === 'mastered') {
      list = list.filter((c) => progress.cardStatus[c.id] === 'mastered');
    } else if (selectedMastery === 'learning') {
      list = list.filter((c) => progress.cardStatus[c.id] === 'learning');
    } else if (selectedMastery === 'new') {
      list = list.filter((c) => !progress.cardStatus[c.id] || progress.cardStatus[c.id] === 'new');
    }

    return list;
  }, [database.cards, seriesId, posterId, selectedType, selectedMastery, progress]);

  // Card deck management
  const [deck, setDeck] = useState<Card[]>(filteredCards);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isChangingCardRef = React.useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setDeck(filteredCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowRule(false);
  }, [filteredCards]);

  const currentCard = deck[currentIndex] || null;

  const handleFlip = useCallback(() => {
    if (isChangingCardRef.current) return;
    sound.playFlip();
    setIsFlipped((prev) => !prev);
  }, []);

  const navigateCard = useCallback((direction: 'next' | 'prev') => {
    if (deck.length === 0 || isChangingCardRef.current) return;
    sound.playClick();
    setShowRule(false);

    const getNewIndex = (prev: number) => {
      if (direction === 'next') {
        return (prev + 1) % deck.length;
      }
      return (prev - 1 + deck.length) % deck.length;
    };

    if (isFlipped) {
      isChangingCardRef.current = true;
      setIsFlipped(false);
      // Wait for card flip to pass 90deg threshold so backface is rotated away before changing card
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => getNewIndex(prev));
        isChangingCardRef.current = false;
      }, 240);
    } else {
      setCurrentIndex((prev) => getNewIndex(prev));
    }
  }, [deck.length, isFlipped]);

  const handleNext = useCallback(() => {
    navigateCard('next');
  }, [navigateCard]);

  const handlePrev = useCallback(() => {
    navigateCard('prev');
  }, [navigateCard]);

  const handleShuffle = () => {
    if (isChangingCardRef.current) return;
    sound.playClick();
    setShowRule(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);

    if (isFlipped) {
      isChangingCardRef.current = true;
      setIsFlipped(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setDeck(shuffled);
        setCurrentIndex(0);
        isChangingCardRef.current = false;
      }, 240);
    } else {
      setDeck(shuffled);
      setCurrentIndex(0);
    }
  };

  const handleRate = useCallback((status: MasteryStatus) => {
    if (!currentCard || isChangingCardRef.current) return;
    if (status === 'mastered') sound.playCorrect();
    else sound.playClick();

    const cardId = currentCard.id;
    setProgress((prev) => updateCardMastery(cardId, status, prev));
    handleNext();
  }, [currentCard, handleNext, setProgress]);

  const handleToggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    sound.playClick();
    setProgress((prev) => toggleStarCard(currentCard.id, prev));
  };

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    speakGerman(currentCard.german);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        handlePrev();
      } else if (e.code === 'KeyV' || e.code === 'KeyS') {
        if (currentCard) speakGerman(currentCard.german);
      } else if (e.key === '1') {
        handleRate('new');
      } else if (e.key === '2') {
        handleRate('learning');
      } else if (e.key === '3') {
        handleRate('mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, currentCard]);

  // Gender color styling helper
  const getGenderBadge = (gender: Gender) => {
    if (gender === 'masculine') {
      return { label: 'DER · MASCULINE', bg: 'bg-german-der text-white' };
    }
    if (gender === 'feminine') {
      return { label: 'DIE · FEMININE', bg: 'bg-german-die text-white' };
    }
    if (gender === 'neuter') {
      return { label: 'DAS · NEUTER', bg: 'bg-german-das text-white' };
    }
    return null;
  };

  const genderBadge = currentCard ? getGenderBadge(currentCard.gender) : null;
  const isStarred = currentCard ? progress.starredCardIds.includes(currentCard.id) : false;
  const cardMastery = currentCard ? progress.cardStatus[currentCard.id] || 'new' : 'new';

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 sm:py-6 space-y-3 sm:space-y-6">
      {/* Filter Toolbar */}
      <div className="sm:bg-cream-50 sm:border sm:border-ink/20 sm:rounded-lg sm:p-4 sm:shadow-sm sm:space-y-3">
        <div className="hidden sm:flex items-center justify-between border-b border-ink/10 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-ink/80">
            <Filter className="w-3.5 h-3.5 text-german-amber" />
            Deck Filters & Focus
          </div>
          <div className="text-xs font-mono text-ink/70">
            {deck.length} {deck.length === 1 ? 'card' : 'cards'} available
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-3 text-xs">
          <div>
            <label className="hidden sm:block font-mono text-ink/60 mb-1">CONTENT TYPE</label>
            <select
              aria-label="Content type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-cream-100 border border-ink/20 rounded px-2 py-1.5 sm:px-2.5 text-ink font-medium focus:outline-none focus:border-ink"
            >
              <option value="all">All types</option>
              <option value="noun">Nouns (with Articles)</option>
              <option value="verb">Verbs & Conjugations</option>
              <option value="sentence">Example Sentences</option>
              <option value="phrase">Phrases & Idioms</option>
              <option value="false_friend">False Friends</option>
            </select>
          </div>

          <div>
            <label className="hidden sm:block font-mono text-ink/60 mb-1">MASTERY</label>
            <select
              aria-label="Mastery"
              value={selectedMastery}
              onChange={(e) => setSelectedMastery(e.target.value)}
              className="w-full bg-cream-100 border border-ink/20 rounded px-2 py-1.5 sm:px-2.5 text-ink font-medium focus:outline-none focus:border-ink"
            >
              <option value="all">All cards ({deck.length})</option>
              <option value="starred">★ Starred Cards</option>
              <option value="new">Needs Practice</option>
              <option value="learning">Learning</option>
              <option value="mastered">Mastered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Flashcard Arena */}
      {deck.length === 0 ? (
        <div className="bg-cream-50 border border-ink/20 rounded-xl p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-ink/30 mx-auto" />
          <h3 className="text-lg font-bold text-ink font-display">No flashcards found</h3>
          <p className="text-sm text-ink/70 max-w-md mx-auto">
            Try loosening your filters above to see more cards from other series or mastery levels.
          </p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedMastery('all');
            }}
            className="px-4 py-2 bg-ink text-cream-50 rounded-lg font-medium text-sm hover:bg-ink/90 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-4">
          {/* Deck Status Bar */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-ink/70 px-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink">
                CARD {currentIndex + 1} OF {deck.length}
              </span>
              <span className="text-ink/30">|</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{currentCard?.poster_title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1 hover:text-ink transition-colors px-2 py-0.5 rounded hover:bg-cream-200"
                title="Shuffle deck"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Shuffle</span>
              </button>

              {onViewPoster && currentCard && (
                <button
                  onClick={() => onViewPoster(currentCard.poster_id, currentCard.series_id)}
                  className="flex items-center gap-1 hover:text-ink transition-colors px-2 py-0.5 rounded hover:bg-cream-200"
                  title="View original high-res poster"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Poster</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden border border-ink/10">
            <div
              className="bg-german-amber h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            ></div>
          </div>

          {/* 3D Tactile Card */}
          <div
            onClick={handleFlip}
            className="perspective-1000 cursor-pointer select-none group min-h-[240px] sm:min-h-[420px]"
          >
            <div
              className={`
                relative w-full h-full min-h-[240px] sm:min-h-[420px] rounded-2xl border-2 border-ink bg-cream-50
                shadow-poster hover:shadow-poster-lg transition-all duration-500 transform-style-3d
                ${isFlipped ? 'rotate-y-180' : ''}
              `}
            >
              {/* FRONT OF CARD (GERMAN) */}
              <div className="absolute inset-0 w-full h-full p-4 sm:p-8 flex flex-col justify-between backface-hidden corner-registration">
                {/* Front Header Badges */}
                <div className="flex items-start justify-between gap-2 border-b border-ink/10 pb-2 sm:pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {genderBadge && (
                      <span className={`text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded ${genderBadge.bg}`}>
                        {genderBadge.label}
                      </span>
                    )}
                    <span className="text-[11px] font-mono tracking-wider px-2 py-0.5 rounded bg-cream-200 border border-ink/20 text-ink uppercase">
                      {currentCard?.type.replace('_', ' ')}
                    </span>
                    {currentCard?.section && (
                      <span className="text-[11px] font-mono text-ink/60 truncate max-w-[180px]">
                        {currentCard.section}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleToggleStar}
                      className={`p-1.5 rounded-full transition-colors ${
                        isStarred ? 'text-german-amber hover:text-german-amber/80' : 'text-ink/30 hover:text-ink/70'
                      }`}
                      title="Star for review"
                    >
                      <Star className={`w-5 h-5 ${isStarred ? 'fill-german-amber' : ''}`} />
                    </button>
                    <button
                      onClick={handleAudio}
                      className="p-1.5 rounded-full text-ink/60 hover:text-ink hover:bg-cream-200 transition-colors"
                      title="Pronounce in German (V)"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Front Core Content */}
                <div className="my-auto py-3 sm:py-6 text-center space-y-2 sm:space-y-4">
                  {/* Visual Pictogram Anchor */}
                  <div className="flex justify-center -mb-1">
                    <PictogramIcon
                      name={currentCard?.pictogram}
                      german={currentCard?.german}
                      gender={currentCard?.gender}
                      type={currentCard?.type}
                      size={28}
                    />
                  </div>

                  <h2
                    className={`
                      font-bold tracking-tight text-ink font-display
                      ${currentCard?.german.length && currentCard.german.length > 35 ? 'text-xl sm:text-3xl' : 'text-2xl sm:text-5xl'}
                    `}
                  >
                    {currentCard?.german}
                  </h2>

                  {currentCard?.hint && (
                    <p className="text-xs sm:text-sm font-mono text-ink/60 italic">
                      Context: {currentCard.hint}
                    </p>
                  )}
                </div>

                {/* Front Footer Action Prompt */}
                <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-ink/10 text-[10px] sm:text-xs font-mono text-ink/50">
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Tap to flip</span>
                    <span className="hidden sm:inline">
                      Click card or press <kbd className="bg-cream-200 px-1 rounded border border-ink/20">Space</kbd> to reveal
                    </span>
                  </span>
                  <span className="font-semibold truncate max-w-[45%] text-right">{currentCard?.poster_title}</span>
                </div>
              </div>

              {/* BACK OF CARD (ENGLISH & HOW IT WORKS) */}
              <div className="absolute inset-0 w-full h-full p-4 sm:p-8 flex flex-col justify-between backface-hidden rotate-y-180 corner-registration bg-cream-50">
                {/* Back Header */}
                <div className="flex items-start justify-between gap-2 border-b border-ink/10 pb-2 sm:pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-ink text-cream-50 uppercase">
                      ENGLISH TRANSLATION
                    </span>
                    {cardMastery === 'mastered' && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-german-das font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleAudio}
                    className="p-1.5 rounded-full text-ink/60 hover:text-ink hover:bg-cream-200 transition-colors"
                    title="Pronounce again"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Back Content */}
                <div className="my-auto py-4 space-y-4 text-center">
                  <div className="flex justify-center -mb-2">
                    <PictogramIcon
                      name={currentCard?.pictogram}
                      german={currentCard?.german}
                      gender={currentCard?.gender}
                      type={currentCard?.type}
                      size={28}
                    />
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-bold text-ink font-display tracking-tight">
                    {currentCard?.english}
                  </h3>

                  <div className="inline-block px-4 py-1.5 rounded-lg bg-cream-100 border border-ink/15 text-ink/80 text-sm font-medium">
                    {currentCard?.german}
                  </div>

                  {/* HOW IT WORKS Collapsible Rule Box */}
                  {currentCard?.rule && (
                    <div className="mt-4 text-left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRule(!showRule);
                        }}
                        className="flex items-center gap-1.5 text-xs font-mono font-bold text-german-amber hover:text-german-amber/80 mb-1"
                      >
                        <Info className="w-3.5 h-3.5" />
                        {showRule ? 'Hide Grammatical Rule' : 'Show Poster Rule & Tip'}
                      </button>

                      {showRule && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="bg-cream-100/90 border border-german-amber/50 rounded-lg p-3 text-xs text-ink/90 leading-relaxed max-h-36 overflow-y-auto"
                        >
                          <span className="font-bold text-german-amber block mb-1">HOW IT WORKS:</span>
                          {currentCard.rule}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Back Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-ink/10 text-xs font-mono text-ink/50">
                  <span>Rate your recall below</span>
                  <span>{currentCard?.poster_id} · {currentCard?.poster_title}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Control Bar (Navigation & Self Rating) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-0 sm:pt-2">
            {/* Left: Previous / Flip / Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border-2 border-ink bg-cream-50 font-mono text-xs font-bold text-ink hover:bg-cream-200 active:translate-y-0.5 transition-all shadow-sm"
                title="Previous card (Left Arrow / A)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleFlip}
                className="flex-[1.5] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border-2 border-ink bg-cream-50 font-mono text-xs font-bold text-ink hover:bg-cream-200 active:translate-y-0.5 transition-all shadow-sm"
                title="Flip card (Space)"
              >
                <RotateCw className="w-4 h-4" />
                <span>Flip</span>
              </button>

              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border-2 border-ink bg-cream-50 font-mono text-xs font-bold text-ink hover:bg-cream-200 active:translate-y-0.5 transition-all shadow-sm"
                title="Next card (Right Arrow / D)"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Mastery Recall Grading Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRate('new')}
                className="flex flex-col items-center justify-center px-2 py-2 rounded-lg border-2 border-german-die bg-german-die/10 hover:bg-german-die/20 text-german-die font-mono text-xs font-bold transition-all active:translate-y-0.5"
                title="Needs practice (1)"
              >
                <span>Again</span>
                <span className="hidden sm:inline text-[10px] opacity-70">Key [1]</span>
              </button>

              <button
                onClick={() => handleRate('learning')}
                className="flex flex-col items-center justify-center px-2 py-2 rounded-lg border-2 border-german-amber bg-german-amber/10 hover:bg-german-amber/20 text-german-amber font-mono text-xs font-bold transition-all active:translate-y-0.5"
                title="Good / Review later (2)"
              >
                <span>Good</span>
                <span className="hidden sm:inline text-[10px] opacity-70">Key [2]</span>
              </button>

              <button
                onClick={() => handleRate('mastered')}
                className="flex flex-col items-center justify-center px-2 py-2 rounded-lg border-2 border-german-das bg-german-das/10 hover:bg-german-das/20 text-german-das font-mono text-xs font-bold transition-all active:translate-y-0.5"
                title="Mastered! (3)"
              >
                <span>Mastered</span>
                <span className="hidden sm:inline text-[10px] opacity-70">Key [3]</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
