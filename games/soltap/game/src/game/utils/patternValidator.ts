import { Pattern } from '../types';
import { Logger } from '../../utils/Logger';

export class PatternValidator {
  private logger: Logger;
  private currentPattern: Pattern | null = null;
  private currentIndex: number = 0;
  private patternStartTime: number = 0;
  private isValidating: boolean = false;

  constructor() {
    this.logger = new Logger('PatternValidator');
  }

  startValidating(pattern: Pattern) {
    this.currentPattern = pattern;
    this.currentIndex = 0;
    this.patternStartTime = Date.now();
    this.isValidating = true;
    this.logger.info('Started validating pattern:', pattern);
  }

  validateTap(circleIndex: number): boolean {
    if (!this.isValidating || !this.currentPattern) {
      return false;
    }

    const isCorrect = circleIndex === this.currentPattern.index;
    const elapsedTime = Date.now() - this.patternStartTime;

    if (!isCorrect) {
      this.logger.warn('Incorrect tap:', { expected: this.currentPattern.index, received: circleIndex });
      this.isValidating = false;
      return false;
    }

    if (this.currentPattern.duration && elapsedTime > this.currentPattern.duration) {
      this.logger.warn('Tap too slow:', { elapsed: elapsedTime, max: this.currentPattern.duration });
      this.isValidating = false;
      return false;
    }

    // For single-tap patterns, complete immediately
    this.logger.info('Pattern completed successfully');
    this.isValidating = false;
    return true;
  }

  isActive(): boolean {
    return this.isValidating;
  }

  getCurrentPattern(): Pattern | null {
    return this.currentPattern;
  }
}
