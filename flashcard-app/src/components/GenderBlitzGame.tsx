import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Zap, RotateCcw, Volume2, Award, ArrowRight } from 'lucide-react';
import { Database, UserProgress, Card, Gender } from '../types';
import { sound, speakGerman } from '../utils/sound';
import { updateHighScore } from '../utils/storage';
import { PictogramIcon } from './PictogramIcon';
import { filterCardsByTopic } from '../utils/topic';

interface GenderBlitzGameProps {
  database: Database;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  seriesId: string;
  posterId: string;
}

export const GenderBlitzGame: React.FC<GenderBlitzGameProps> = ({
  database,
  progress,
  setProgress,
  seriesId,
  posterId,
}) => {
  const nounCards = useMemo(() => {
    return filterCardsByTopic(database.cards, seriesId, posterId).filter(
      (c) => c.type === 'noun' && c.gender && ['masculine', 'feminine', 'neuter'].includes(c.gender)
    );
  }, [database.cards, seriesId, posterId]);

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; text: string; article: string } | null>(null);

  const [shuffledNouns, setShuffledNouns] = useState<Card[]>([]);

  const currentNoun = shuffledNouns[currentIndex] || null;

  // Extract base noun without article (e.g. "der Mann" -> "Mann")
  const getCleanNoun = (german: string) => {
    return german.replace(/^(der|die|das|ein|eine)\s+/i, '').trim();
  };

  const startGame = useCallback(() => {
    sound.playClick();
    const shuffled = [...nounCards].sort(() => Math.random() - 0.5);
    setShuffledNouns(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(45);
    setLastFeedback(null);
    setGameState('playing');
  }, [nounCards]);

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Handle game over logic & high score
  useEffect(() => {
    if (gameState === 'gameover') {
      const { updated, isNewHigh } = updateHighScore('genderBlitz', score, progress);
      if (isNewHigh) {
        setProgress(updated);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1B4B8A', '#C41E3A', '#2D6A4F', '#C9A227'],
        });
      }
    }
  }, [gameState, score, progress, setProgress]);

  const handleGuess = useCallback(
    (guessedGender: Gender) => {
      if (gameState !== 'playing' || !currentNoun) return;

      const isCorrect = currentNoun.gender === guessedGender;
      const correctArticle = currentNoun.gender === 'masculine' ? 'DER' : currentNoun.gender === 'feminine' ? 'DIE' : 'DAS';

      if (isCorrect) {
        sound.playCorrect();
        const streakBonus = Math.floor(streak / 5) * 5;
        const addedScore = 10 + streakBonus;
        setScore((s) => s + addedScore);
        setStreak((s) => {
          const next = s + 1;
          if (next > maxStreak) setMaxStreak(next);
          if (next % 5 === 0) sound.playStreak();
          return next;
        });
        setLastFeedback({ isCorrect: true, text: `Correct! +${addedScore}`, article: correctArticle });
      } else {
        sound.playWrong();
        setStreak(0);
        setLastFeedback({
          isCorrect: false,
          text: `It's ${correctArticle} ${getCleanNoun(currentNoun.german)}!`,
          article: correctArticle,
        });
      }

      // Next word
      setCurrentIndex((idx) => (idx + 1) % shuffledNouns.length);
    },
    [gameState, currentNoun, streak, maxStreak, shuffledNouns.length]
  );

  // Keyboard controls for 1, 2, 3 or Left, Up, Right arrows
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1' || e.key === 'ArrowLeft' || e.code === 'KeyJ') {
        handleGuess('masculine');
      } else if (e.key === '2' || e.key === 'ArrowUp' || e.code === 'KeyK') {
        handleGuess('feminine');
      } else if (e.key === '3' || e.key === 'ArrowRight' || e.code === 'KeyL') {
        handleGuess('neuter');
      } else if (e.code === 'KeyV' && currentNoun) {
        speakGerman(currentNoun.german);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleGuess, currentNoun]);

  const highScore = progress.scores.genderBlitz || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-cream-50 border-2 border-ink rounded-xl p-5 shadow-poster flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-german-amber animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-ink uppercase">
              SPEED BLITZ · DER DIE DAS
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-ink tracking-tight">
            Gender Lightning Round
          </h2>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="bg-cream-200 border border-ink/20 px-3 py-1.5 rounded text-center">
            <span className="text-ink/60 block text-[10px]">HIGH SCORE</span>
            <span className="font-bold text-ink text-sm flex items-center gap-1 justify-center">
              <Award className="w-3.5 h-3.5 text-german-amber" /> {highScore}
            </span>
          </div>

          <div className="bg-cream-200 border border-ink/20 px-3 py-1.5 rounded text-center">
            <span className="text-ink/60 block text-[10px]">BANK</span>
            <span className="font-bold text-ink text-sm">{nounCards.length} nouns</span>
          </div>
        </div>
      </div>

      {gameState === 'idle' && (
        <div className="bg-cream-50 border-2 border-ink rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-poster-lg">
          <div className="w-16 h-16 rounded-2xl bg-german-amber/20 border-2 border-german-amber text-german-amber flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 fill-german-amber" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-2xl font-black font-display text-ink">
              Ready for the 45-second sprint?
            </h3>
            <p className="text-sm text-ink/70 leading-relaxed">
              Test your instinct on German noun genders. Hit <span className="text-german-der font-bold">DER</span>,{' '}
              <span className="text-german-die font-bold">DIE</span>, or{' '}
              <span className="text-german-das font-bold">DAS</span> as fast as you can. Build combos for bonus points!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-xs font-mono text-ink/70">
            <span className="px-2.5 py-1 rounded bg-cream-200 border border-ink/20">Key [1] = DER</span>
            <span className="px-2.5 py-1 rounded bg-cream-200 border border-ink/20">Key [2] = DIE</span>
            <span className="px-2.5 py-1 rounded bg-cream-200 border border-ink/20">Key [3] = DAS</span>
          </div>

          {nounCards.length === 0 ? (
            <p className="text-sm font-mono text-ink/60">
              No gendered nouns in this topic. Pick another series or poster.
            </p>
          ) : (
            <button
              onClick={startGame}
              className="px-8 py-3.5 bg-ink text-cream-50 rounded-xl font-bold font-mono tracking-wider text-sm hover:bg-ink/90 active:translate-y-0.5 transition-all shadow-tactile hover:shadow-none"
            >
              START BLITZ ROUND
            </button>
          )}
        </div>
      )}

      {gameState === 'playing' && currentNoun && (
        <div className="space-y-4">
          {/* Dashboard (Score, Timer, Streak) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-cream-50 border border-ink/20 rounded-lg p-3 text-center shadow-sm">
              <span className="text-[10px] font-mono text-ink/60 uppercase block">TIME LEFT</span>
              <span className={`text-2xl font-black font-mono ${timeLeft <= 10 ? 'text-german-die animate-pulse' : 'text-ink'}`}>
                {timeLeft}s
              </span>
            </div>

            <div className="bg-cream-50 border border-ink/20 rounded-lg p-3 text-center shadow-sm">
              <span className="text-[10px] font-mono text-ink/60 uppercase block">SCORE</span>
              <span className="text-2xl font-black font-mono text-german-amber">{score}</span>
            </div>

            <div className="bg-cream-50 border border-ink/20 rounded-lg p-3 text-center shadow-sm">
              <span className="text-[10px] font-mono text-ink/60 uppercase block">STREAK</span>
              <span className="text-2xl font-black font-mono text-german-das">
                {streak > 0 ? `🔥 ${streak}` : '0'}
              </span>
            </div>
          </div>

          {/* Prompt Arena */}
          <div className="bg-cream-50 border-2 border-ink rounded-2xl p-8 sm:p-12 text-center relative shadow-poster space-y-4 min-h-[220px] flex flex-col justify-center corner-registration">
            {/* Pronunciation & hint */}
            <div className="flex items-center justify-between text-xs font-mono text-ink/60">
              <span className="truncate">{currentNoun.poster_title}</span>
              <button
                onClick={() => speakGerman(currentNoun.german)}
                className="p-1 rounded hover:bg-cream-200 text-ink/80 transition-colors flex items-center gap-1"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4" />
                <span className="text-[10px]">Listen</span>
              </button>
            </div>

            {/* Pictogram Visual Anchor */}
            <div className="flex justify-center -mb-1">
              <PictogramIcon
                name={currentNoun.pictogram}
                german={currentNoun.german}
                gender={currentNoun.gender}
                type={currentNoun.type}
                size={34}
              />
            </div>

            {/* Target German Noun without article */}
            <h1 className="text-4xl sm:text-6xl font-black text-ink font-display tracking-tight">
              {getCleanNoun(currentNoun.german)}
            </h1>

            {/* English translation */}
            <p className="text-base sm:text-lg font-medium text-ink/70">
              {currentNoun.english}
            </p>

            {/* Micro feedback banner */}
            {lastFeedback && (
              <div
                className={`text-xs font-mono font-bold tracking-wider py-1 px-3 rounded-full inline-block mx-auto ${
                  lastFeedback.isCorrect
                    ? 'bg-german-das/15 text-german-das border border-german-das/30'
                    : 'bg-german-die/15 text-german-die border border-german-die/30'
                }`}
              >
                {lastFeedback.text}
              </div>
            )}
          </div>

          {/* Giant Interactive Gender Buttons */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => handleGuess('masculine')}
              className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl border-2 border-german-der bg-german-der text-white font-mono font-black text-lg sm:text-2xl tracking-wider hover:opacity-95 active:translate-y-1 transition-all shadow-tactile hover:shadow-none"
            >
              <span>DER</span>
              <span className="text-[11px] font-normal opacity-75 mt-1 hidden sm:inline">MASCULINE [1]</span>
            </button>

            <button
              onClick={() => handleGuess('feminine')}
              className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl border-2 border-german-die bg-german-die text-white font-mono font-black text-lg sm:text-2xl tracking-wider hover:opacity-95 active:translate-y-1 transition-all shadow-tactile hover:shadow-none"
            >
              <span>DIE</span>
              <span className="text-[11px] font-normal opacity-75 mt-1 hidden sm:inline">FEMININE [2]</span>
            </button>

            <button
              onClick={() => handleGuess('neuter')}
              className="group flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl border-2 border-german-das bg-german-das text-white font-mono font-black text-lg sm:text-2xl tracking-wider hover:opacity-95 active:translate-y-1 transition-all shadow-tactile hover:shadow-none"
            >
              <span>DAS</span>
              <span className="text-[11px] font-normal opacity-75 mt-1 hidden sm:inline">NEUTER [3]</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="bg-cream-50 border-2 border-ink rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-poster-lg">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">
              ROUND COMPLETE
            </span>
            <h2 className="text-4xl font-black font-display text-ink">
              Final Score: {score}
            </h2>
            {score > highScore && score > 0 && (
              <p className="text-sm font-mono font-bold text-german-amber">
                ★ NEW PERSONAL BEST! ★
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-xs font-mono">
            <div className="bg-cream-200 border border-ink/20 p-3 rounded">
              <span className="text-ink/60 block">MAX STREAK</span>
              <span className="text-xl font-bold text-ink">🔥 {maxStreak}</span>
            </div>
            <div className="bg-cream-200 border border-ink/20 p-3 rounded">
              <span className="text-ink/60 block">TIME</span>
              <span className="text-xl font-bold text-ink">45s</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 bg-ink text-cream-50 rounded-xl font-mono text-xs font-bold tracking-wider hover:bg-ink/90 transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" /> PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
