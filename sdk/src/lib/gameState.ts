import { GameState, GameUser } from './types';

export class GameStateManager {
  private state: GameState;

  constructor() {
    this.state = {
      currentScore: 0,
      currentRewards: {
        inGamePoints: 0,
        tokenPoints: 0
      },
      sessionStartTime: Date.now(),
      lastUpdateTime: Date.now(),
      isActive: true
    };
  }

  setUser(user: GameUser): void {
    this.state.user = user;
  }

  getUser(): GameUser | undefined {
    return this.state.user;
  }

  setScore(score: number): void {
    this.state.currentScore = score;
  }

  getScore(): number {
    return this.state.currentScore;
  }

  setHighScore(score: number): void {
    this.state.highScore = score;
  }

  getHighScore(): number | undefined {
    return this.state.highScore;
  }

  getState(): GameState {
    return { ...this.state };
  }
}
