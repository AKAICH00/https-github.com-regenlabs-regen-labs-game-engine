import { GameConfig, GameScore, GameUser, TelegramResponse } from './types';

export class GameAPI {
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
  }

  async submitScore(score: GameScore): Promise<boolean> {
    const response = await fetch(`${this.config.baseUrl}/api/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(score)
    });
    
    const data = await response.json() as TelegramResponse;
    return data.ok;
  }

  async getHighScore(userId: number): Promise<number> {
    const response = await fetch(
      `${this.config.baseUrl}/api/score/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    const data = await response.json() as TelegramResponse;
    return data.ok ? data.result : 0;
  }
}
