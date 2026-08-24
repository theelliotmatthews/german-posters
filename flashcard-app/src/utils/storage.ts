import { UserProgress, MasteryStatus } from '../types';

const STORAGE_KEY = 'schulwandkarte_progress_v1';

const defaultProgress: UserProgress = {
  cardStatus: {},
  starredCardIds: [],
  scores: {
    genderBlitz: 0,
    speedQuiz: 0,
    wordScramble: 0,
    matchGrid: 0,
  },
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  soundEnabled: true,
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return {
      ...defaultProgress,
      ...parsed,
      scores: { ...defaultProgress.scores, ...(parsed.scores || {}) },
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function updateCardMastery(
  cardId: string,
  status: MasteryStatus,
  current: UserProgress
): UserProgress {
  const updated = {
    ...current,
    cardStatus: {
      ...current.cardStatus,
      [cardId]: status,
    },
  };
  saveProgress(updated);
  return updated;
}

export function toggleStarCard(cardId: string, current: UserProgress): UserProgress {
  const isStarred = current.starredCardIds.includes(cardId);
  const updatedStarred = isStarred
    ? current.starredCardIds.filter(id => id !== cardId)
    : [...current.starredCardIds, cardId];

  const updated = {
    ...current,
    starredCardIds: updatedStarred,
  };
  saveProgress(updated);
  return updated;
}

export function updateHighScore(
  gameKey: keyof UserProgress['scores'],
  score: number,
  current: UserProgress
): { updated: UserProgress; isNewHigh: boolean } {
  const currentHigh = current.scores[gameKey] || 0;
  if (score > currentHigh) {
    const updated = {
      ...current,
      scores: {
        ...current.scores,
        [gameKey]: score,
      },
    };
    saveProgress(updated);
    return { updated, isNewHigh: true };
  }
  return { updated: current, isNewHigh: false };
}
