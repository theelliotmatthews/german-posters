import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Volume2, Star, BookOpen } from 'lucide-react';
import { Database, Card } from '../types';
import { speakGerman } from '../utils/sound';
import { PictogramIcon } from './PictogramIcon';
import { cardTopicLabel } from '../utils/labels';

interface CardSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: Database;
  onSelectCard: (card: Card) => void;
}

export const CardSearchModal: React.FC<CardSearchModalProps> = ({
  isOpen,
  onClose,
  database,
  onSelectCard,
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  // Global shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return database.cards.slice(0, 30);

    return database.cards
      .filter(
        (c) =>
          c.german.toLowerCase().includes(q) ||
          c.english.toLowerCase().includes(q) ||
          c.poster_title.toLowerCase().includes(q) ||
          (c.poster_title_en || '').toLowerCase().includes(q) ||
          c.section.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [database.cards, query]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm p-4 flex items-start justify-center pt-16 sm:pt-24"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-cream-50 border-2 border-ink rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-ink/15 flex items-center gap-3 bg-cream-100">
          <Search className="w-5 h-5 text-ink/60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search German words, English meanings, grammar rules…"
            autoFocus
            className="w-full bg-transparent border-none outline-none text-ink text-sm sm:text-base placeholder:text-ink/40 font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-ink/50 hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono bg-cream-200 border border-ink/20 px-1.5 py-0.5 rounded text-ink/60">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          <div className="text-[11px] font-mono text-ink/50 px-2 py-1">
            {query ? `Found ${results.length} results` : `Showing popular cards across ${database.stats.total_posters} posters`}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink/60 font-mono">
              No matching vocabulary or rules found.
            </div>
          ) : (
            results.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  onSelectCard(card);
                  onClose();
                }}
                className="group p-3 rounded-xl bg-cream-100 hover:bg-cream-200 border border-ink/10 hover:border-ink/30 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <PictogramIcon
                    name={card.pictogram}
                    german={card.german}
                    gender={card.gender}
                    type={card.type}
                    size={20}
                    className="p-1.5 shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink text-sm sm:text-base font-display">
                        {card.german}
                      </span>
                      {card.gender && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded text-white font-bold ${
                            card.gender === 'masculine'
                              ? 'bg-german-der'
                              : card.gender === 'feminine'
                              ? 'bg-german-die'
                              : 'bg-german-das'
                          }`}
                        >
                          {card.gender.slice(0, 3).toUpperCase()}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-ink/50 uppercase">
                        {card.type}
                      </span>
                    </div>
                    <div className="text-xs text-ink/70 truncate">{card.english}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-ink/40 hidden sm:inline">
                    {cardTopicLabel(card)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakGerman(card.german);
                    }}
                    className="p-1.5 rounded-full hover:bg-cream-300 text-ink/60"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
