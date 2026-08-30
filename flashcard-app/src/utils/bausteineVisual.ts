import { Poster } from '../types';

export const BAUSTEINE_TEXT_SERIES = 'bausteine';
export const BAUSTEINE_VISUAL_SERIES = 'bausteine-visual';

/** Text poster id -> visual poster id */
export const BAUSTEINE_TEXT_TO_VISUAL: Record<string, string> = {
  '01': '04',
  '02': '02',
  '03': '03',
  '04': '01',
};

export function isBausteineSeries(seriesId: string): boolean {
  return seriesId === BAUSTEINE_TEXT_SERIES || seriesId === BAUSTEINE_VISUAL_SERIES;
}

export function bausteineVisualPosterId(textPosterId: string): string | null {
  return BAUSTEINE_TEXT_TO_VISUAL[textPosterId] ?? null;
}

export function bausteineTextPosterId(visualPosterId: string): string | null {
  const entry = Object.entries(BAUSTEINE_TEXT_TO_VISUAL).find(([, visualId]) => visualId === visualPosterId);
  return entry ? entry[0] : null;
}

export function getBausteinePair(
  posters: Poster[],
  poster: Poster,
): { text: Poster; visual: Poster } | null {
  if (!isBausteineSeries(poster.series_id)) return null;

  let textId: string | null;
  let visualId: string | null;

  if (poster.series_id === BAUSTEINE_TEXT_SERIES) {
    textId = poster.id;
    visualId = poster.paired_poster_id ?? bausteineVisualPosterId(poster.id);
  } else {
    visualId = poster.id;
    textId = poster.paired_poster_id ?? bausteineTextPosterId(poster.id);
  }

  if (!textId || !visualId) return null;

  const text = posters.find((p) => p.series_id === BAUSTEINE_TEXT_SERIES && p.id === textId);
  const visual = posters.find((p) => p.series_id === BAUSTEINE_VISUAL_SERIES && p.id === visualId);
  if (!text || !visual) return null;
  return { text, visual };
}

export function resolveBausteineImagePoster(
  posters: Poster[],
  poster: Poster,
  preferVisual: boolean,
): Poster {
  const pair = getBausteinePair(posters, poster);
  if (!pair) return poster;
  return preferVisual ? pair.visual : pair.text;
}

export function switchBausteineSeries(seriesId: string, preferVisual: boolean): string {
  if (seriesId === BAUSTEINE_TEXT_SERIES && preferVisual) return BAUSTEINE_VISUAL_SERIES;
  if (seriesId === BAUSTEINE_VISUAL_SERIES && !preferVisual) return BAUSTEINE_TEXT_SERIES;
  return seriesId;
}

export function findBausteinePosterInSeries(
  posters: Poster[],
  poster: Poster,
  targetSeriesId: string,
): Poster | null {
  if (!isBausteineSeries(poster.series_id) || !isBausteineSeries(targetSeriesId)) return null;
  if (poster.series_id === targetSeriesId) return poster;

  const pair = getBausteinePair(posters, poster);
  if (!pair) return null;
  return targetSeriesId === BAUSTEINE_VISUAL_SERIES ? pair.visual : pair.text;
}
