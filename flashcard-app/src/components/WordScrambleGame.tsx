import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Layers, RotateCcw, Volume2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Database, UserProgress, Card } from '../types';
import { sound, speakGerman } from '../utils/sound';
import { filterCardsByTopic } from '../utils/topic';

interface WordScrambleGameProps {
  database: Database;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  seriesId: string;
  posterId: string;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({
  database,
  seriesId,
  posterId,
}) => {
  const sentenceCards = useMemo(() => {
    return filterCardsByTopic(database.cards, seriesId, posterId).filter((c) => {
      if (c.type !== 'sentence') return false;
      const wordCount = c.german.trim().split(/\s+/).length;
      return wordCount >= 3 && wordCount <= 9;
    });
  }, [database.cards, seriesId, posterId]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shuffledSentences, setShuffledSentences] = useState<Card[]>([]);
  const [availableWords, setAvailableWords] = useState<{ id: string; word: string }[]>([]);
  const [selectedWords, setSelectedWords] = useState<{ id: string; word: string }[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentCard = shuffledSentences[currentIndex] || null;

  const cleanWord = (w: string) => w.replace(/[.,!?:;]/g, '').trim();

  // Load question
  const loadQuestion = useCallback((card: Card) => {
    const rawWords = card.german.trim().split(/\s+/);
    const mapped = rawWords.map((w, idx) => ({ id: `${idx}-${w}`, word: w }));
    const shuffled = [...mapped].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setIsCorrect(null);
  }, []);

  const startNewSession = useCallback(() => {
    const shuffled = [...sentenceCards].sort(() => Math.random() - 0.5);
    setShuffledSentences(shuffled);
    setCurrentIndex(0);
    if (shuffled.length > 0) {
      loadQuestion(shuffled[0]);
    }
  }, [sentenceCards, loadQuestion]);

  useEffect(() => {
    startNewSession();
  }, [startNewSession]);

  const handleSelectWord = (item: { id: string; word: string }) => {
    sound.playClick();
    setAvailableWords((prev) => prev.filter((w) => w.id !== item.id));
    setSelectedWords((prev) => [...prev, item]);
  };

  const handleDeselectWord = (item: { id: string; word: string }) => {
    sound.playClick();
    setSelectedWords((prev) => prev.filter((w) => w.id !== item.id));
    setAvailableWords((prev) => [...prev, item]);
  };

  // Check sentence when all words are placed
  useEffect(() => {
    if (!currentCard || availableWords.length > 0 || selectedWords.length === 0) {
      setIsCorrect(null);
      return;
    }

    const built = selectedWords.map((w) => cleanWord(w.word)).join(' ').toLowerCase();
    const target = currentCard.german.trim().split(/\s+/).map(cleanWord).join(' ').toLowerCase();

    if (built === target) {
      sound.playCorrect();
      setIsCorrect(true);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } else {
      sound.playWrong();
      setIsCorrect(false);
    }
  }, [availableWords, selectedWords, currentCard]);

  const handleNext = () => {
    sound.playClick();
    const nextIdx = (currentIndex + 1) % shuffledSentences.length;
    setCurrentIndex(nextIdx);
    loadQuestion(shuffledSentences[nextIdx]);
  };

  const handleResetCurrent = () => {
    if (currentCard) loadQuestion(currentCard);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-cream-50 border-2 border-ink rounded-xl p-5 shadow-poster flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-german-das" />
            <span className="text-xs font-mono font-bold tracking-widest text-ink uppercase">
              WORTSTELLUNG · WORD ORDER MASTER
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-ink tracking-tight">
            Sentence Structure Builder
          </h2>
        </div>

        <button
          onClick={startNewSession}
          className="p-2 rounded-lg border border-ink/20 hover:bg-cream-200 text-ink/80 transition-colors"
          title="Restart session"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {sentenceCards.length === 0 ? (
        <div className="bg-cream-50 border-2 border-ink rounded-2xl p-8 text-center text-sm text-ink/70 font-mono">
          No sentences in this topic to scramble. Try Grundlagen I (Foundations I) or All topics (every series).
        </div>
      ) : currentCard && (
        <div className="space-y-6">
          {/* Target Box */}
          <div className="bg-cream-50 border-2 border-ink rounded-2xl p-8 text-center shadow-poster space-y-4 corner-registration">
            <span className="text-xs font-mono font-bold text-ink/50 uppercase tracking-wider block">
              ARRANGE WORDS IN CORRECT GERMAN SYNTAX
            </span>

            <h3 className="text-xl sm:text-3xl font-black text-ink font-display">
              "{currentCard.english}"
            </h3>

            {currentCard.hint && (
              <p className="text-xs font-mono text-ink/60 italic">Rule: {currentCard.hint}</p>
            )}
          </div>

          {/* Builder Drop Zone */}
          <div className="bg-cream-100 border-2 border-dashed border-ink/40 rounded-2xl p-6 min-h-[120px] flex flex-wrap items-center justify-center gap-2.5">
            {selectedWords.length === 0 ? (
              <span className="text-sm font-mono text-ink/40">
                Click words below to assemble the sentence…
              </span>
            ) : (
              selectedWords.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleDeselectWord(item)}
                  className="px-4 py-2.5 bg-ink text-cream-50 rounded-xl font-mono text-sm sm:text-base font-bold tracking-wide hover:bg-ink/80 active:translate-y-0.5 transition-all shadow-sm"
                >
                  {item.word}
                </button>
              ))
            )}
          </div>

          {/* Available Word Chips */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-ink/60 uppercase block text-center">
              AVAILABLE WORDS
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {availableWords.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectWord(item)}
                  className="px-4 py-2.5 bg-cream-50 border-2 border-ink text-ink rounded-xl font-mono text-sm sm:text-base font-bold tracking-wide hover:bg-cream-200 active:translate-y-0.5 transition-all shadow-tactile hover:shadow-none"
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Banner */}
          {isCorrect === true && (
            <div className="bg-german-das/15 border-2 border-german-das rounded-xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-german-das font-bold font-mono text-sm">
                <CheckCircle2 className="w-5 h-5" /> Perfekt! Correct Word Order.
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => speakGerman(currentCard.german)}
                  className="px-3 py-1.5 rounded bg-cream-50 border border-german-das/30 text-xs font-mono text-ink hover:bg-cream-200 flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
                <button
                  onClick={handleNext}
                  className="px-5 py-1.5 bg-german-das text-white rounded-lg font-mono text-xs font-bold hover:opacity-90 flex items-center gap-1.5"
                >
                  Next Sentence <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {isCorrect === false && (
            <div className="bg-german-die/15 border-2 border-german-die rounded-xl p-4 text-center space-y-2">
              <div className="text-german-die font-bold font-mono text-sm">
                Not quite right. Check verb position and connectors!
              </div>
              <button
                onClick={handleResetCurrent}
                className="px-4 py-1.5 bg-german-die text-white rounded-lg font-mono text-xs font-bold hover:opacity-90"
              >
                Reset & Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
