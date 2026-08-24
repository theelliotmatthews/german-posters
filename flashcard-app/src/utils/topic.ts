import { Card } from '../types';

export function filterCardsByTopic(
  cards: Card[],
  seriesId: string,
  posterId: string,
): Card[] {
  return cards.filter((card) => {
    if (seriesId !== 'all' && card.series_id !== seriesId) return false;
    if (posterId === 'all') return true;
    if (posterId.includes('::')) {
      const [sid, pid] = posterId.split('::');
      return card.series_id === sid && card.poster_id === pid;
    }
    return card.poster_id === posterId;
  });
}
