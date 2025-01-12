export type DifficultyMode = 'novice' | 'expert';

export interface Pattern {
  index: number;
  sequence: number[];
  duration: number;
  type?: string;
  count?: number;
}

export interface GameState {
  score: number;
  level: number;
  difficulty: DifficultyMode;
  patterns: Pattern[];
  isPlaying: boolean;
}
