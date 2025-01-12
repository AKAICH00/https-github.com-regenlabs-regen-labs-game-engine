import { GameState, GameUser, GameRewards } from './types';

export class GameStateManager {
  private state: GameState;

  constructor() {
    const initialRewards: GameRewards = {
      inGamePoints: 0,
      tokenPoints: 0,
      multiplier: 1
    };

    this.state = {
      currentScore: 0,
      currentRewards: initialRewards,
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
    this.state.lastUpdateTime = Date.now();
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

  updateRewards(rewards: GameRewards): void {
    this.state.currentRewards = rewards;
    this.state.lastUpdateTime = Date.now();
  }

  getCurrentRewards(): GameRewards {
    return this.state.currentRewards;
  }

  getSessionDuration(): number {
    return Date.now() - this.state.sessionStartTime;
  }

  endSession(): void {
    this.state.isActive = false;
    this.state.lastUpdateTime = Date.now();
  }
}
