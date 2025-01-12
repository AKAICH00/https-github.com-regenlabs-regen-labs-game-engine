import { DifficultyMode, Pattern } from '../types';
import { GAME_CONFIG } from '../constants';

export class PatternGenerator {
  static generate(level: number, circleCount: number, difficulty: DifficultyMode): Pattern[] {
    const patternLength = Math.min(level + 2, GAME_CONFIG.maxPatterns);
    const patterns: Pattern[] = [];

    for (let i = 0; i < patternLength; i++) {
      patterns.push({
        index: Math.floor(Math.random() * circleCount),
        duration: GAME_CONFIG.basePatternDuration - (level * GAME_CONFIG.patternSpeedIncrease)
      });
    }

    if (difficulty === 'expert') {
      // Add some complexity for expert mode
      patterns.forEach(pattern => {
        pattern.duration = Math.max(pattern.duration * 0.8, 200);
      });
    }

    return patterns;
  }
}
