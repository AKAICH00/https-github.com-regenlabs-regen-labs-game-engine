export * from './lib/types';
export * from './lib/api';
export * from './lib/gameState';

import { GameAPI } from './lib/api';
import { GameStateManager } from './lib/gameState';
import { GameConfig, GameUser, GameScore, GameRewards } from './lib/types';

export class GameSDK {
  private api: GameAPI;
  private state: GameStateManager;

  constructor(config: GameConfig) {
    this.api = new GameAPI(config);
    this.state = new GameStateManager();
  }

  setUser(user: GameUser): void {
    this.state.setUser(user);
  }

  async submitScore(score: number): Promise<boolean> {
    const user = this.state.getUser();
    if (!user) {
      throw new Error('User not set');
    }

    const rewards = this.state.getCurrentRewards();
    const gameScore: GameScore = {
      score,
      userId: user.id,
      rewards,
      timestamp: Date.now()
    };

    const result = await this.api.submitScore(gameScore);

    if (result) {
      const highScore = await this.api.getHighScore(user.id);
      if (highScore !== null) {
        this.state.setHighScore(highScore);
      }
    }

    return result;
  }

  getScore(): number {
    return this.state.getScore();
  }

  getHighScore(): number | undefined {
    return this.state.getHighScore();
  }

  getUser(): GameUser | undefined {
    return this.state.getUser();
  }

  getCurrentRewards(): GameRewards {
    return this.state.getCurrentRewards();
  }

  updateRewards(rewards: GameRewards): void {
    this.state.updateRewards(rewards);
  }
}
