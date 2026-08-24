import React, { useCallback, useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { Headphones, Mic, RotateCcw, Volume2, Award, Eye } from 'lucide-react';
import { Database, UserProgress, Card } from '../types';
import { sound, speakGerman } from '../utils/sound';
import { updateHighScore } from '../utils/storage';
import { filterCardsByTopic } from '../utils/topic';
import { cardTopicLabel } from '../utils/labels';

interface ListenSpeakGameProps {
  database: Database;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  seriesId: string;
  posterId: string;
}

type Mode = 'listen' | 'speak';

function pickDistractors(pool: Card[], target: Card, n: number): string[] {
  const others = pool.filter((c) => c.id !== target.id && c.english !== target.english);
  return [...others].sort(() => Math.random() - 0.5).slice(0, n).map((c) => c.english);
}

export const ListenSpeakGame: React.FC<ListenSpeakGameProps> = ({
  database,
  progress,
  setProgress,
  seriesId,
  posterId,
}) => {
  const [mode, setMode] = useState<Mode>('listen');
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [done, setDone] = useState<boolean>(false);

  const pool = useMemo(() => {
    const filtered = filterCardsByTopic(database.cards, seriesId, posterId).filter(
      (c) => c.type === 'sentence' || c.type === 'phrase',
    );
    if (filtered.length >= 6) return filtered;
    return database.cards.filter((c) => c.series_id === 'kurs-plus' && (c.poster_id === '05' || c.poster_id === '06'));
  }, [database.cards, seriesId, posterId]);

  const queue = useMemo(() => [...pool].sort(() => Math.random() - 0.5).slice(0, 12), [pool, mode]);
  const current = queue[index] || null;

  const playPrompt = useCallback(
    (card: Card | null) => {
      if (!card) return;
      speakGerman(card.german, mode === 'listen' ? 0.82 : 0.92);
    },
    [mode],
  );

  useEffect(() => {
    setIndex(0);
    setScore(0);
    setRevealed(false);
    setChosen(null);
    setDone(false);
  }, [mode, seriesId, posterId, queue.length]);

  useEffect(() => {
    if (!current) return;
    setRevealed(false);
    setChosen(null);
    const opts = [current.english, ...pickDistractors(pool.length >= 4 ? pool : database.cards, current, 3)];
    setOptions([...opts].sort(() => Math.random() - 0.5));
    if (mode === 'listen') {
      const t = window.setTimeout(() => playPrompt(current), 250);
      return () => window.clearTimeout(t);
    }
  }, [current, mode, pool, database.cards, playPrompt]);

  const finish = (finalScore: number) => {
    setDone(true);
    const { updated } = updateHighScore('listenSpeak', finalScore, progress);
    setProgress(updated);
    if (finalScore >= 8) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    }
  };

  const onListenPick = (option: string) => {
    if (chosen || !current) return;
    setChosen(option);
    const correct = option === current.english;
    if (correct) {
      sound.playCorrect();
      setScore((s) => s + 1);
    } else {
      sound.playWrong();
    }
    window.setTimeout(() => {
      const next = index + 1;
      const nextScore = score + (correct ? 1 : 0);
      if (next >= queue.length) finish(nextScore);
      else setIndex(next);
    }, 700);
  };

  const onSpoke = () => {
    if (!current) return;
    sound.playClick();
    setRevealed(true);
    playPrompt(current);
  };

  const onSpeakNext = (knewIt: boolean) => {
    const nextScore = score + (knewIt ? 1 : 0);
    if (knewIt) sound.playCorrect();
    setScore(nextScore);
    const next = index + 1;
    if (next >= queue.length) finish(nextScore);
    else setIndex(next);
  };

  if (!current && !done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center font-mono text-sm text-ink/70">
        Not enough sentence cards in this topic. Open Kurs Plus (Course Plus) · Hören (Listening) or Sprechen (Speaking).
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode('listen')}
            className={`px-3 py-1.5 text-xs font-mono font-bold border-2 ${
              mode === 'listen' ? 'bg-ink text-cream-50 border-ink' : 'border-ink/20 bg-cream-50'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 inline mr-1" />
            Listen (Hören)
          </button>
          <button
            type="button"
            onClick={() => setMode('speak')}
            className={`px-3 py-1.5 text-xs font-mono font-bold border-2 ${
              mode === 'speak' ? 'bg-ink text-cream-50 border-ink' : 'border-ink/20 bg-cream-50'
            }`}
          >
            <Mic className="w-3.5 h-3.5 inline mr-1" />
            Speak (Sprechen)
          </button>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-ink/70">
          <span>
            {done ? queue.length : index + 1}/{queue.length}
          </span>
          <span>Score {score}</span>
          <span>Best {progress.scores.listenSpeak || 0}</span>
          <button type="button" onClick={() => setMode(mode)} className="p-1 border border-ink/20" title="Restart">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {done ? (
        <div className="border-2 border-ink bg-cream-50 p-8 text-center space-y-3">
          <Award className="w-8 h-8 mx-auto text-german-amber" />
          <h2 className="font-display text-2xl font-black">Durchgang fertig (Round done)</h2>
          <p className="font-mono text-sm">
            {score} / {queue.length}
          </p>
          <button
            type="button"
            onClick={() => setMode(mode)}
            className="px-4 py-2 bg-ink text-cream-50 text-sm font-mono"
          >
            Again
          </button>
        </div>
      ) : (
        <div className="border-2 border-ink bg-cream-50 p-5 sm:p-8 space-y-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink/50">
            {current ? cardTopicLabel(current) : ''} · {mode === 'listen' ? 'Hear German, pick English' : 'See English, say German'}
          </div>

          {mode === 'listen' ? (
            <>
              <button
                type="button"
                onClick={() => playPrompt(current)}
                className="w-full py-8 border-2 border-ink bg-cream-100 hover:bg-cream-200 font-display text-xl font-bold"
              >
                <Volume2 className="w-6 h-6 mx-auto mb-2" />
                Play German again
              </button>
              <div className="grid gap-2">
                {options.map((opt) => {
                  const show = Boolean(chosen);
                  const isRight = opt === current?.english;
                  const isPick = opt === chosen;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onListenPick(opt)}
                      className={`text-left px-3 py-2.5 border text-sm ${
                        show && isRight
                          ? 'border-german-das bg-german-das/15'
                          : show && isPick
                            ? 'border-german-die bg-german-die/10'
                            : 'border-ink/20 hover:border-ink'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p className="font-display text-2xl font-bold text-ink leading-snug">{current?.english}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onSpoke}
                  className="px-3 py-2 border-2 border-ink bg-ink text-cream-50 text-xs font-mono font-bold"
                >
                  <Mic className="w-3.5 h-3.5 inline mr-1" />I said it — play model
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRevealed(true);
                    playPrompt(current);
                  }}
                  className="px-3 py-2 border-2 border-ink/20 text-xs font-mono"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  Show German
                </button>
              </div>
              {revealed && (
                <div className="space-y-3">
                  <p className="font-display text-xl font-bold">{current?.german}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onSpeakNext(true)}
                      className="px-3 py-2 bg-ink text-cream-50 text-xs font-mono"
                    >
                      I had it
                    </button>
                    <button
                      type="button"
                      onClick={() => onSpeakNext(false)}
                      className="px-3 py-2 border border-ink/30 text-xs font-mono"
                    >
                      Not yet
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
