export type DifficultyMode = 'novice' | 'expert';

export interface Pattern {
  index: number;
  type?: string;
  duration?: number;
  count?: number;
}

export interface GameState {
  score: number;
  level: number;
  difficulty: DifficultyMode;
  patterns: Pattern[];
  isPlaying: boolean;
}
