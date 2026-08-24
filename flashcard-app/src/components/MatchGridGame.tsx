import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Grid, RotateCcw, Volume2, Check } from 'lucide-react';
import { Database, UserProgress, Card } from '../types';
import { sound, speakGerman } from '../utils/sound';
import { filterCardsByTopic } from '../utils/topic';

interface MatchGridGameProps {
  database: Database;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  seriesId: string;
  posterId: string;
}

interface Tile {
  id: string; // unique tile id
  cardId: string;
  text: string;
  lang: 'de' | 'en';
  isFlipped: boolean;
  isMatched: boolean;
  card: Card;
}

export const MatchGridGame: React.FC<MatchGridGameProps> = ({
  database,
  seriesId,
  posterId,
}) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [pairCount, setPairCount] = useState<number>(6);

  const startNewGame = useCallback(() => {
    const pool = filterCardsByTopic(database.cards, seriesId, posterId);
    const pickedCards = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    setPairCount(pickedCards.length);

    const generatedTiles: Tile[] = [];
    pickedCards.forEach((card, idx) => {
      generatedTiles.push({
        id: `tile-de-${idx}`,
        cardId: card.id,
        text: card.german,
        lang: 'de',
        isFlipped: false,
        isMatched: false,
        card,
      });
      generatedTiles.push({
        id: `tile-en-${idx}`,
        cardId: card.id,
        text: card.english,
        lang: 'en',
        isFlipped: false,
        isMatched: false,
        card,
      });
    });

    setTiles(generatedTiles.sort(() => Math.random() - 0.5));
    setSelectedTileIds([]);
    setMoves(0);
    setMatchesCount(0);
    setIsWon(false);
  }, [database.cards, seriesId, posterId]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleTileClick = (tile: Tile) => {
    if (tile.isMatched || tile.isFlipped || selectedTileIds.length >= 2) return;

    sound.playFlip();

    // Flip selected tile
    const newTiles = tiles.map((t) => (t.id === tile.id ? { ...t, isFlipped: true } : t));
    setTiles(newTiles);

    const newSelected = [...selectedTileIds, tile.id];
    setSelectedTileIds(newSelected);

    if (tile.lang === 'de') {
      speakGerman(tile.text);
    }

    // If 2 tiles selected, check for match
    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const first = newTiles.find((t) => t.id === newSelected[0])!;
      const second = newTiles.find((t) => t.id === newSelected[1])!;

      if (first.cardId === second.cardId && first.lang !== second.lang) {
        // Match!
        sound.playCorrect();
        setTimeout(() => {
          setTiles((prev) =>
            prev.map((t) =>
              t.cardId === first.cardId ? { ...t, isMatched: true, isFlipped: true } : t
            )
          );
          setSelectedTileIds([]);
          setMatchesCount((c) => {
            const next = c + 1;
            if (next === pairCount) {
              setIsWon(true);
              sound.playStreak();
              confetti({ particleCount: 70, spread: 60 });
            }
            return next;
          });
        }, 400);
      } else {
        // No match
        sound.playWrong();
        setTimeout(() => {
          setTiles((prev) =>
            prev.map((t) =>
              newSelected.includes(t.id) && !t.isMatched ? { ...t, isFlipped: false } : t
            )
          );
          setSelectedTileIds([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-cream-50 border-2 border-ink rounded-xl p-5 shadow-poster flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-german-amber" />
            <span className="text-xs font-mono font-bold tracking-widest text-ink uppercase">
              MEMORY PAIR MATCH
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-ink tracking-tight">
            Pair the German & English Cards
          </h2>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={startNewGame}
            className="p-2 rounded-lg border border-ink/20 hover:bg-cream-200 text-ink/80 transition-colors"
            title="Reset game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs font-mono text-ink/70 px-1">
        <span>MATCHES: <strong className="text-ink">{matchesCount} / {pairCount}</strong></span>
        <span>MOVES: <strong className="text-ink">{moves}</strong></span>
      </div>

      {tiles.length === 0 ? (
        <div className="bg-cream-50 border-2 border-dashed border-ink/20 rounded-xl p-8 text-center text-sm text-ink/70">
          No cards in this topic to match. Pick another series or poster.
        </div>
      ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {tiles.map((tile) => {
          let style = 'bg-cream-50 border-2 border-ink hover:bg-cream-200 text-ink';

          if (tile.isMatched) {
            style = 'bg-german-das/15 border-2 border-german-das text-german-das pointer-events-none opacity-80';
          } else if (tile.isFlipped) {
            style = tile.lang === 'de'
              ? 'bg-german-der/10 border-2 border-german-der text-german-der font-bold'
              : 'bg-german-amber/10 border-2 border-german-amber text-ink font-bold';
          }

          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              disabled={tile.isMatched || (tile.isFlipped && selectedTileIds.includes(tile.id))}
              className={`
                h-28 sm:h-32 p-3.5 rounded-xl text-center flex flex-col justify-between items-center
                transition-all duration-300 shadow-sm ${style}
              `}
            >
              <div className="w-full flex items-center justify-between text-[10px] font-mono opacity-50">
                <span>{tile.isFlipped || tile.isMatched ? (tile.lang === 'de' ? 'DEUTSCH' : 'ENGLISH') : 'CARD'}</span>
                {tile.isMatched && <Check className="w-3.5 h-3.5 text-german-das" />}
              </div>

              <div className="my-auto font-medium text-xs sm:text-sm line-clamp-3 leading-snug">
                {tile.isFlipped || tile.isMatched ? tile.text : '???'}
              </div>

              <div className="text-[9px] font-mono opacity-30 truncate w-full">
                {tile.isFlipped || tile.isMatched ? tile.card.poster_title : '• • •'}
              </div>
            </button>
          );
        })}
      </div>
      )}

      {isWon && (
        <div className="bg-cream-50 border-2 border-ink rounded-2xl p-8 text-center space-y-4 shadow-poster-lg">
          <h3 className="text-3xl font-black font-display text-ink">
            Wunderbar! Board Cleared in {moves} moves!
          </h3>
          <button
            onClick={startNewGame}
            className="px-6 py-2.5 bg-ink text-cream-50 rounded-xl font-mono text-xs font-bold tracking-wider hover:bg-ink/90 transition-all shadow-sm"
          >
            PLAY NEXT GRID
          </button>
        </div>
      )}
    </div>
  );
};
