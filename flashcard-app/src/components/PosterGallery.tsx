import React, { useState, useMemo } from 'react';
import { Image as ImageIcon, BookOpen, ExternalLink, X, ZoomIn, Layers, Volume2 } from 'lucide-react';
import { Database, Poster, Card } from '../types';
import { speakGerman } from '../utils/sound';
import { PictogramIcon } from './PictogramIcon';
import { seriesLabel, posterLabel } from '../utils/labels';

interface PosterGalleryProps {
  database: Database;
  onStudyPosterDeck: (posterId: string, seriesId: string) => void;
  selectedPosterId?: string | null;
  selectedSeriesId?: string | null;
}

export const PosterGallery: React.FC<PosterGalleryProps> = ({
  database,
  onStudyPosterDeck,
  selectedPosterId,
  selectedSeriesId,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<string>(selectedSeriesId || 'all');
  const [activePoster, setActivePoster] = useState<Poster | null>(() => {
    if (selectedPosterId && selectedSeriesId) {
      return database.posters.find((p) => p.id === selectedPosterId && p.series_id === selectedSeriesId) || null;
    }
    return null;
  });

  const filteredPosters = useMemo(() => {
    if (selectedSeries === 'all') return database.posters;
    return database.posters.filter((p) => p.series_id === selectedSeries);
  }, [database.posters, selectedSeries]);

  const getPosterImageUrl = (poster: Poster) => {
    // If local symlink exists under /posters/, use that, or fallback to remote fal.media url
    return `/posters/${poster.image_file}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Filter */}
      <div className="bg-cream-50 border-2 border-ink rounded-xl p-5 shadow-poster flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-german-der" />
            <span className="text-xs font-mono font-bold tracking-widest text-ink uppercase">
              POSTER WALL · {database.stats.total_posters} HIGH-RES CHARTS
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-ink tracking-tight">
            Original Schulwandkarte Wall Gallery
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className="bg-cream-100 border border-ink/20 rounded px-3 py-1.5 text-xs font-mono text-ink font-medium focus:outline-none focus:border-ink"
          >
            <option value="all">All Series ({database.stats.total_posters} Posters)</option>
            {database.series.map((s) => (
              <option key={s.id} value={s.id}>
                {seriesLabel(s)} ({s.level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Posters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredPosters.map((poster) => {
          const imgSrc = getPosterImageUrl(poster);
          return (
            <div
              key={`${poster.series_id}-${poster.id}`}
              onClick={() => setActivePoster(poster)}
              className="group cursor-pointer bg-cream-50 border-2 border-ink rounded-xl overflow-hidden shadow-poster hover:shadow-poster-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Image Container with 4:5 Aspect Ratio */}
              <div className="relative aspect-4/5 bg-cream-200 overflow-hidden border-b border-ink/20">
                <img
                  src={imgSrc}
                  alt={posterLabel(poster)}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to fal url if local image load fails
                    if (poster.image_url) {
                      (e.target as HTMLImageElement).src = poster.image_url;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-ink text-cream-50 text-[11px] font-mono px-2.5 py-1 rounded shadow transition-opacity flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5" /> Inspect
                  </span>
                </div>
                <span className="absolute top-2 right-2 bg-ink/80 text-cream-50 font-mono text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {poster.plate_number}
                </span>
              </div>

              {/* Caption */}
              <div className="p-3 space-y-1">
                <span className="text-[10px] font-mono text-ink/50 uppercase block truncate">
                  {poster.series_english_name
                    ? `${poster.series_name} (${poster.series_english_name})`
                    : poster.series_name}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-ink line-clamp-1 font-display">
                  {posterLabel(poster)}
                </h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-ink/70 pt-1">
                  <span>{poster.card_count} cards</span>
                  <span className="text-german-der font-semibold group-hover:underline">Study →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Poster Deep Dive Lightbox Modal */}
      {activePoster && (
        <div
          onClick={() => setActivePoster(null)}
          className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cream-50 border-2 border-ink rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Left: Poster Image Preview */}
            <div className="md:w-1/2 bg-cream-200 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-ink/20 overflow-auto">
              <img
                src={getPosterImageUrl(activePoster)}
                alt={posterLabel(activePoster)}
                onError={(e) => {
                  if (activePoster.image_url) {
                    (e.target as HTMLImageElement).src = activePoster.image_url;
                  }
                }}
                className="max-h-[75vh] w-auto object-contain rounded shadow-lg border border-ink/20"
              />
            </div>

            {/* Right: Knowledge breakdown & extracted cards */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh] space-y-6">
              <div className="space-y-4">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-2 border-b border-ink/10 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider text-german-amber uppercase">
                      {seriesLabel({
                        name: activePoster.series_name,
                        english_name: activePoster.series_english_name,
                      })}{' '}
                      · {activePoster.series_badge} · PLATE {activePoster.plate_number}
                    </span>
                    <h3 className="text-2xl font-black font-display text-ink tracking-tight">
                      {posterLabel(activePoster)}
                    </h3>
                    {activePoster.subtitle && (
                      <p className="text-xs font-mono text-ink/60">{activePoster.subtitle}</p>
                    )}
                  </div>

                  <button
                    onClick={() => setActivePoster(null)}
                    className="p-1 rounded-full hover:bg-cream-200 text-ink/70"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* HOW IT WORKS Explanation Box */}
                {activePoster.how_it_works && (
                  <div className="bg-cream-100 border border-ink/15 rounded-xl p-4 space-y-1 text-xs text-ink/80 leading-relaxed">
                    <span className="font-mono font-bold uppercase text-[10px] block text-german-amber">
                      HOW IT WORKS (MENTAL MODEL):
                    </span>
                    <p>{activePoster.how_it_works}</p>
                  </div>
                )}

                {/* Extracted Cards List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-ink/70">
                    <span className="font-bold uppercase">EXTRACTED CARDS ({activePoster.cards.length})</span>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {activePoster.cards.map((c: Card) => (
                      <div
                        key={c.id}
                        className="bg-cream-100 border border-ink/10 rounded-lg p-2.5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <PictogramIcon
                            name={c.pictogram}
                            german={c.german}
                            gender={c.gender}
                            type={c.type}
                            size={16}
                            className="p-1 shrink-0"
                          />
                          <div className="space-y-0.5">
                            <div className="font-bold text-ink flex items-center gap-1.5">
                              <span>{c.german}</span>
                              <button
                                onClick={() => speakGerman(c.german)}
                                className="text-ink/40 hover:text-ink"
                                title="Listen"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-ink/70 text-[11px]">{c.english}</div>
                          </div>
                        </div>

                        {c.gender && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded text-white font-bold ${
                              c.gender === 'masculine'
                                ? 'bg-german-der'
                                : c.gender === 'feminine'
                                ? 'bg-german-die'
                                : 'bg-german-das'
                            }`}
                          >
                            {c.gender.slice(0, 3).toUpperCase()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-ink/10">
                <button
                  onClick={() => {
                    const pid = activePoster.id;
                    const sid = activePoster.series_id;
                    setActivePoster(null);
                    onStudyPosterDeck(pid, sid);
                  }}
                  className="w-full py-3 bg-ink text-cream-50 rounded-xl font-mono text-xs font-bold tracking-wider hover:bg-ink/90 transition-all flex items-center justify-center gap-2 shadow-tactile hover:shadow-none"
                >
                  <BookOpen className="w-4 h-4" /> STUDY THIS POSTER'S DECK ({activePoster.cards.length} CARDS)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
