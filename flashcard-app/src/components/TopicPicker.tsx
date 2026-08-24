import React, { useMemo } from 'react';
import { Database } from '../types';
import { seriesLabel, posterLabel } from '../utils/labels';

interface TopicPickerProps {
  database: Database;
  seriesId: string;
  posterId: string;
  onSeriesChange: (seriesId: string) => void;
  onPosterChange: (posterId: string) => void;
}

export const TopicPicker: React.FC<TopicPickerProps> = ({
  database,
  seriesId,
  posterId,
  onSeriesChange,
  onPosterChange,
}) => {
  const posters = useMemo(() => {
    if (seriesId === 'all') return database.posters;
    return database.posters.filter((p) => p.series_id === seriesId);
  }, [database.posters, seriesId]);

  const handleSeriesChange = (next: string) => {
    onSeriesChange(next);
    onPosterChange('all');
  };

  const posterSelect = (
    <select
      aria-label="Poster"
      value={posterId}
      onChange={(e) => onPosterChange(e.target.value)}
      className="w-full min-w-0 bg-cream-100 border border-ink/20 px-2 py-1.5 text-xs font-mono text-ink font-medium focus:outline-none focus:border-ink"
    >
      <option value="all">
        {seriesId === 'all'
          ? `All posters (${database.stats.total_posters})`
          : `All in series (${posters.length})`}
      </option>
      {posters.map((p) => {
        const value = seriesId === 'all' ? `${p.series_id}::${p.id}` : p.id;
        const label =
          seriesId === 'all'
            ? `${seriesLabel({ name: p.series_name, english_name: p.series_english_name })} · ${posterLabel(p)}`
            : `${p.plate_number} ${posterLabel(p)}`;
        return (
          <option key={`${p.series_id}-${p.id}`} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );

  return (
    <div className="border-b border-ink/15 bg-cream-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-3 space-y-0 sm:space-y-2.5">
        <div className="hidden sm:flex items-baseline justify-between gap-3">
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-ink/70 uppercase">
            Thema · Choose a topic
          </span>
          <span className="text-[10px] font-mono text-ink/50">
            {database.stats.total_series} series · {database.stats.total_posters} posters
          </span>
        </div>

        <div className="sm:hidden grid grid-cols-2 gap-1.5">
          <select
            aria-label="Topic"
            value={seriesId}
            onChange={(e) => handleSeriesChange(e.target.value)}
            className="w-full min-w-0 bg-cream-100 border border-ink/20 px-2 py-1.5 text-xs font-mono text-ink font-medium focus:outline-none focus:border-ink"
          >
            <option value="all">All topics (every series)</option>
            {database.series.map((s) => (
              <option key={s.id} value={s.id}>
                {seriesLabel(s)}
              </option>
            ))}
          </select>
          {posterSelect}
        </div>

        <div className="hidden sm:flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleSeriesChange('all')}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold tracking-wide border-2 transition-colors ${
              seriesId === 'all'
                ? 'bg-ink text-cream-50 border-ink'
                : 'bg-cream-100 text-ink border-ink/20 hover:border-ink/50'
            }`}
          >
            All topics (every series)
          </button>
          {database.series.map((s) => {
            const active = seriesId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSeriesChange(s.id)}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold tracking-wide border-2 border-l-4 transition-colors ${
                  active
                    ? 'bg-cream-50 text-ink border-ink'
                    : 'bg-cream-100 text-ink/80 border-ink/20 hover:border-ink/50'
                }`}
                style={{ borderLeftColor: s.color }}
                title={s.description}
              >
                {seriesLabel(s)}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <label className="text-[10px] font-mono font-bold text-ink/60 uppercase tracking-wider shrink-0">
            Poster
          </label>
          {posterSelect}
        </div>
      </div>
    </div>
  );
};
