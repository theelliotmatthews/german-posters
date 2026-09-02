import { UserProgress } from '../types';
import { ZOO_ANIMALS } from '../data/adventures/zooQuest';

export interface ZooAdventureProgress {
  questStarted: boolean;
  animalsLearned: string[];
  questComplete: boolean;
}

export interface AdventureProgress {
  zoo: ZooAdventureProgress;
}

const defaultZooProgress: ZooAdventureProgress = {
  questStarted: false,
  animalsLearned: [],
  questComplete: false,
};

export function getZooProgress(progress: UserProgress): ZooAdventureProgress {
  return progress.adventure?.zoo ?? defaultZooProgress;
}

export function startZooQuest(progress: UserProgress): UserProgress {
  return {
    ...progress,
    adventure: {
      ...progress.adventure,
      zoo: {
        ...getZooProgress(progress),
        questStarted: true,
      },
    },
  };
}

export function learnZooAnimal(progress: UserProgress, animalId: string): UserProgress {
  const zoo = getZooProgress(progress);
  const animalsLearned = zoo.animalsLearned.includes(animalId)
    ? zoo.animalsLearned
    : [...zoo.animalsLearned, animalId];
  return {
    ...progress,
    adventure: {
      ...progress.adventure,
      zoo: {
        ...zoo,
        questStarted: true,
        animalsLearned,
      },
    },
  };
}

export function completeZooQuest(progress: UserProgress): UserProgress {
  const zoo = getZooProgress(progress);
  return {
    ...progress,
    adventure: {
      ...progress.adventure,
      zoo: {
        ...zoo,
        questComplete: zoo.animalsLearned.length >= ZOO_ANIMALS.length,
      },
    },
  };
}

export function resetZooQuest(progress: UserProgress): UserProgress {
  return {
    ...progress,
    adventure: {
      ...progress.adventure,
      zoo: { ...defaultZooProgress },
    },
  };
}
