import { Card, Poster } from '../types';

export function seriesLabel(series: { name: string; english_name?: string }): string {
  if (series.english_name && series.english_name !== series.name) {
    return `${series.name} (${series.english_name})`;
  }
  return series.name;
}

export function posterLabel(poster: Pick<Poster, 'title' | 'english_title'>): string {
  if (poster.english_title && poster.english_title.toLowerCase() !== poster.title.toLowerCase()) {
    return `${poster.title} (${poster.english_title})`;
  }
  return poster.title;
}

export function cardTopicLabel(card: Pick<Card, 'poster_title' | 'poster_title_en'>): string {
  if (card.poster_title_en && card.poster_title_en.toLowerCase() !== card.poster_title.toLowerCase()) {
    return `${card.poster_title} (${card.poster_title_en})`;
  }
  return card.poster_title;
}

export function posterLabelFromCard(
  posters: Poster[],
  seriesId: string,
  posterId: string,
  fallbackTitle: string,
): string {
  const poster = posters.find((p) => p.series_id === seriesId && p.id === posterId);
  if (poster) return posterLabel(poster);
  return fallbackTitle;
}
