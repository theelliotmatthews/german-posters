export type CardType = 'noun' | 'verb' | 'sentence' | 'phrase' | 'false_friend';
export type Gender = 'masculine' | 'feminine' | 'neuter' | null;

export interface Card {
  id: string;
  german: string;
  english: string;
  type: CardType;
  gender: Gender;
  section: string;
  hint: string;
  extra: string;
  pictogram: string;
  rule: string;
  poster_id: string;
  poster_title: string;
  poster_title_en?: string;
  series_id: string;
}

export interface Poster {
  id: string;
  plate_number: string;
  title: string;
  english_title?: string;
  subtitle: string;
  how_it_works: string;
  image_file: string;
  image_url?: string;
  series_id: string;
  series_name: string;
  series_english_name?: string;
  series_level: string;
  series_badge: string;
  series_color: string;
  card_count: number;
  cards: Card[];
  paired_series_id?: string;
  paired_poster_id?: string;
}

export interface Series {
  id: string;
  name: string;
  english_name?: string;
  level: string;
  badge: string;
  concepts_file: string;
  output_dir: string;
  color: string;
  description: string;
  poster_count: number;
  card_count: number;
}

export interface Database {
  generated_at: string;
  stats: {
    total_series: number;
    total_posters: number;
    total_cards: number;
    levels: string[];
  };
  series: Series[];
  posters: Poster[];
  cards: Card[];
}

export type MasteryStatus = 'new' | 'learning' | 'mastered';

export interface UserProgress {
  cardStatus: Record<string, MasteryStatus>;
  starredCardIds: string[];
  scores: {
    genderBlitz: number;
    speedQuiz: number;
    wordScramble: number;
    matchGrid: number;
    listenSpeak: number;
    weltQuest: number;
  };
  adventure?: {
    zoo?: {
      questStarted: boolean;
      animalsLearned: string[];
      questComplete: boolean;
    };
  };
  streak: number;
  lastActiveDate: string;
  soundEnabled: boolean;
}
