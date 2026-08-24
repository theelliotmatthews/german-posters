import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, RotateCcw, Volume2, Award, CheckCircle, XCircle } from 'lucide-react';
import { Database, UserProgress, Card } from '../types';
import { sound, speakGerman } from '../utils/sound';
import { updateHighScore } from '../utils/storage';
import { PictogramIcon } from './PictogramIcon';
import { filterCardsByTopic } from '../utils/topic';
import { cardTopicLabel } from '../utils/labels';

interface SpeedQuizGameProps {
  database: Database;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  seriesId: string;
  posterId: string;
}

interface Question {
  card: Card;
  prompt: string;
  correctAnswer: string;
  options: string[];
  mode: 'de_to_en' | 'en_to_de';
}

export const SpeedQuizGame: React.FC<SpeedQuizGameProps> = ({
  database,
  progress,
  setProgress,
  seriesId,
  posterId,
}) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Filter candidate pool
  const candidateCards = useMemo(() => {
    return filterCardsByTopic(database.cards, seriesId, posterId);
  }, [database.cards, seriesId, posterId]);

  // Generate 10 randomized quiz questions with 3 distractors each
  const generateQuestions = useCallback(() => {
    if (candidateCards.length < 4) return [];

    const shuffled = [...candidateCards].sort(() => Math.random() - 0.5).slice(0, 10);
    const generated: Question[] = [];

    shuffled.forEach((targetCard) => {
      const isDeToEn = Math.random() > 0.4;
      const prompt = isDeToEn ? targetCard.german : targetCard.english;
      const correctAnswer = isDeToEn ? targetCard.english : targetCard.german;

      // Pick 3 distractors from same type if possible
      let sameTypeDistractors = candidateCards.filter(
        (c) => c.id !== targetCard.id && (isDeToEn ? c.english !== correctAnswer : c.german !== correctAnswer)
      );

      if (sameTypeDistractors.length < 3) {
        sameTypeDistractors = database.cards.filter((c) => c.id !== targetCard.id);
      }

      const randomDistractors = [...sameTypeDistractors]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((c) => (isDeToEn ? c.english : c.german));

      const options = [correctAnswer, ...randomDistractors].sort(() => Math.random() - 0.5);

      generated.push({
        card: targetCard,
        prompt,
        correctAnswer,
        options,
        mode: isDeToEn ? 'de_to_en' : 'en_to_de',
      });
    });

    return generated;
  }, [candidateCards, database.cards]);

  const startGame = () => {
    sound.playClick();
    const qs = generateQuestions();
    setQuestions(qs);
    setCurrentQuestionIdx(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameState('playing');
  };

  const currentQ = questions[currentQuestionIdx] || null;

  const handleSelectOption = (opt: string) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
    } else {
      sound.playWrong();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentQuestionIdx + 1 >= questions.length) {
      setGameState('gameover');
      const { updated, isNewHigh } = updateHighScore('speedQuiz', score, progress);
      if (isNewHigh) {
        setProgress(updated);
        confetti({ particleCount: 70, spread: 60 });
      }
    } else {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  // Keyboard hotkeys for options (1, 2, 3, 4) & Space for next
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAnswered && currentQ) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (currentQ.options[idx]) handleSelectOption(currentQ.options[idx]);
        }
      } else if (isAnswered && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isAnswered, currentQ, handleNextQuestion]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Quiz Header */}
      <div className="bg-cream-50 border-2 border-ink rounded-xl p-5 shadow-poster flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-german-der" />
            <span className="text-xs font-mono font-bold tracking-widest text-ink uppercase">
              SPEED QUIZ · 10 QUESTION SPRINT
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-ink tracking-tight">
            Multiple-Choice Sprint
          </h2>
        </div>


      </div>

      {gameState === 'idle' && (
        <div className="bg-cream-50 border-2 border-ink rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-poster-lg">
          <div className="w-16 h-16 rounded-2xl bg-german-der/15 border-2 border-german-der text-german-der flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-2xl font-black font-display text-ink">
              Test your recall across vocabulary & rules
            </h3>
            <p className="text-sm text-ink/70 leading-relaxed">
              10 rapid questions pulled directly from the posters. Choose the right match as fast as you can.
            </p>
          </div>

          {candidateCards.length < 4 ? (
            <p className="text-sm font-mono text-ink/60">
              Need at least 4 cards in this topic to start a quiz. Pick a broader topic.
            </p>
          ) : (
            <button
              onClick={startGame}
              className="px-8 py-3.5 bg-ink text-cream-50 rounded-xl font-bold font-mono tracking-wider text-sm hover:bg-ink/90 transition-all shadow-tactile hover:shadow-none"
            >
              START 10-QUESTION SPRINT
            </button>
          )}
        </div>
      )}

      {gameState === 'playing' && currentQ && (
        <div className="space-y-4">
          {/* Progress bar and score */}
          <div className="flex items-center justify-between text-xs font-mono text-ink/70">
            <span>QUESTION {currentQuestionIdx + 1} / {questions.length}</span>
            <span>SCORE: <strong className="text-ink text-sm">{score}</strong></span>
          </div>

          <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden border border-ink/10">
            <div
              className="bg-german-der h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Box */}
          <div className="bg-cream-50 border-2 border-ink rounded-2xl p-8 text-center space-y-4 shadow-poster corner-registration">
            <div className="flex items-center justify-between text-xs font-mono text-ink/50">
              <span>{currentQ.mode === 'de_to_en' ? 'TRANSLATE TO ENGLISH' : 'TRANSLATE TO GERMAN'}</span>
              <span className="truncate">{cardTopicLabel(currentQ.card)}</span>
            </div>

            <div className="flex justify-center -mb-1">
              <PictogramIcon
                name={currentQ.card.pictogram}
                german={currentQ.card.german}
                gender={currentQ.card.gender}
                type={currentQ.card.type}
                size={32}
              />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-ink font-display tracking-tight">
              {currentQ.prompt}
            </h1>

            {currentQ.mode === 'de_to_en' && (
              <button
                onClick={() => speakGerman(currentQ.prompt)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-ink/60 hover:text-ink px-2.5 py-1 rounded bg-cream-100 border border-ink/10 mx-auto"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen
              </button>
            )}
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let style = 'bg-cream-50 border-2 border-ink hover:bg-cream-200 text-ink';

              if (isAnswered) {
                if (isCorrect) {
                  style = 'bg-german-das/15 border-2 border-german-das text-german-das font-bold';
                } else if (isChosen) {
                  style = 'bg-german-die/15 border-2 border-german-die text-german-die';
                } else {
                  style = 'bg-cream-50/50 border-2 border-ink/20 opacity-50 text-ink';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`
                    p-4 rounded-xl font-medium text-sm sm:text-base text-left flex items-center justify-between
                    transition-all shadow-sm ${style}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cream-200 border border-ink/20 flex items-center justify-center font-mono text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && (
                    <div>
                      {isCorrect && <CheckCircle className="w-5 h-5 text-german-das" />}
                      {isChosen && !isCorrect && <XCircle className="w-5 h-5 text-german-die" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          {isAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-ink text-cream-50 rounded-xl font-mono text-xs font-bold tracking-wider hover:bg-ink/90 transition-all flex items-center gap-2 shadow-sm"
              >
                {currentQuestionIdx + 1 >= questions.length ? 'FINISH SPRINT' : 'NEXT QUESTION (Space)'}
              </button>
            </div>
          )}
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="bg-cream-50 border-2 border-ink rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-poster-lg">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">
              QUIZ COMPLETED
            </span>
            <h2 className="text-4xl font-black font-display text-ink">
              Final Score: {score} pts
            </h2>
          </div>

          <button
            onClick={startGame}
            className="flex items-center gap-2 px-6 py-3 bg-ink text-cream-50 rounded-xl font-mono text-xs font-bold tracking-wider hover:bg-ink/90 transition-all shadow-sm mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> TRY ANOTHER SPRINT
          </button>
        </div>
      )}
    </div>
  );
};
