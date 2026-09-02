import React from 'react';
import { Volume2 } from 'lucide-react';
import { speakGerman } from '../../utils/sound';

interface AdventureDialogProps {
  lines: string[];
  lineIndex: number;
  speaker?: string;
  portrait?: string;
  image?: string;
  showContinue?: boolean;
  onAdvance: () => void;
  germanHighlight?: string;
  quiz?: {
    question: string;
    options: string[];
    onAnswer: (option: string) => void;
    feedback?: string | null;
    feedbackOk?: boolean;
  };
}

export const AdventureDialog: React.FC<AdventureDialogProps> = ({
  lines,
  lineIndex,
  speaker,
  portrait,
  image,
  showContinue = true,
  onAdvance,
  quiz,
  germanHighlight,
}) => {
  const currentLine = lines[lineIndex] ?? '';
  const feedback = quiz?.feedback;
  const feedbackOk = quiz?.feedbackOk;

  return (
    <div className="absolute inset-x-2 sm:inset-x-4 bottom-2 sm:bottom-4 z-30 pointer-events-auto">
      <div className="bg-cream-50 border-4 border-ink rounded-xl shadow-2xl overflow-hidden max-w-3xl mx-auto">
        <div className="flex gap-3 p-3 sm:p-4">
          {(portrait || image) && (
            <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 border-2 border-ink/20 rounded-lg overflow-hidden bg-cream-200 flex items-center justify-center">
              <img
                src={image || portrait}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0.15';
                }}
              />
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-2">
            {speaker && (
              <div className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-german-der">
                {speaker}
              </div>
            )}

            {!quiz && (
              <>
                <p className="text-sm sm:text-base text-ink leading-relaxed font-medium">
                  {currentLine}
                </p>
                {germanHighlight && (
                  <button
                    type="button"
                    onClick={() =>
                      speakGerman(germanHighlight.replace(/^(der|die|das)\s+/i, ''))
                    }
                    className="inline-flex items-center gap-1 text-german-das hover:underline text-xs font-mono"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> {germanHighlight}
                  </button>
                )}
              </>
            )}

            {quiz && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-ink">{quiz.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {quiz.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => quiz.onAnswer(opt)}
                      disabled={!!feedback}
                      className="text-left px-3 py-2 rounded-lg border-2 border-ink/25 bg-cream-100 hover:bg-cream-200 text-sm font-bold disabled:opacity-70"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {feedback && (
                  <p
                    className={`text-xs font-mono font-bold ${
                      feedbackOk ? 'text-german-das' : 'text-german-die'
                    }`}
                  >
                    {feedback}
                  </p>
                )}
              </div>
            )}

            {!quiz && showContinue && (
              <button
                type="button"
                onClick={onAdvance}
                className="text-[11px] font-mono font-bold text-german-amber animate-pulse"
              >
                ▶ Space to continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
