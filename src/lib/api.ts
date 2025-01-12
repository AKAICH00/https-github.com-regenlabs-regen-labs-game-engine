import fetch from 'node-fetch';
import { 
  GameScore, 
  GameConfig, 
  TelegramResponse, 
  GameRewards,
  TokenConversionConfig
} from './types';

/**
 * Handles all API interactions for the game platform
 * Includes both Telegram Bot API and game-specific endpoints
 */
export class GameAPI {
  private config: GameConfig;
  private lastGameContext: { chatId?: string; messageId?: string } = {};
  private tokenConfig: TokenConversionConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.tokenConfig = {
      ratio: config.pointsToTokenRatio || 100,
      minThreshold: config.minTokenThreshold || 1000,
      maxDaily: config.maxDailyTokens,
      cooldown: 0 // Default no cooldown
    };
  }

  /**
   * Submits a game score with all associated rewards
   * Handles conversion of points to tokens based on configuration
   */
  async submitScore(score: GameScore): Promise<boolean> {
    try {
      // Validate and initialize game context
      await this.validateGameContext(score);
      
      // Convert in-game points to tokens based on configuration
      const tokenScore = this.calculateTokenScore(score.rewards);
      
      // Update the main score for Telegram
      score.score = tokenScore;

      console.log('Submitting score to Telegram:', {
        user_id: score.userId,
        score: score.score,
        chat_id: score.chatId,
        message_id: score.messageId,
        game_short_name: this.config.gameShortName,
        rewards: score.rewards
      });

      // Submit to Telegram Bot API
      const response = await this.submitToTelegram(score);
      
      // If Web3 is configured, handle token distribution
      if (this.config.web3Provider && this.config.contractAddress) {
        await this.handleTokenDistribution(score);
      }

      return response.ok;
    } catch (error) {
      console.error('Error submitting score:', error);
      return false;
    }
  }

  /**
   * Calculates token score based on in-game points
   */
  private calculateTokenScore(rewards: GameRewards): number {
    const { inGamePoints, multiplier = 1 } = rewards;
    const baseTokens = Math.floor(inGamePoints / this.tokenConfig.ratio);
    return baseTokens * multiplier;
  }

  /**
   * Validates and initializes game context if needed
   */
  private async validateGameContext(score: GameScore): Promise<void> {
    if (!this.config.botToken || !this.config.gameShortName) {
      throw new Error('Bot token and game short name are required');
    }

    if (!score.chatId || !score.messageId) {
      const initResult = await this.initializeGame(score.userId);
      if (initResult) {
        score.chatId = initResult.chatId;
        score.messageId = initResult.messageId;
        this.lastGameContext = {
          chatId: initResult.chatId,
          messageId: initResult.messageId
        };
      } else {
        throw new Error('Failed to initialize game context');
      }
    }
  }

  /**
   * Submits score to Telegram Bot API
   */
  private async submitToTelegram(score: GameScore): Promise<TelegramResponse> {
    const response = await fetch(
      `https://api.telegram.org/bot${this.config.botToken}/setGameScore`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: score.userId,
          score: score.score,
          chat_id: score.chatId,
          message_id: score.messageId,
          force: true // Allow updating lower scores
        })
      }
    );

    const data = await response.json();
    return this.validateTelegramResponse(data);
  }

  /**
   * Validates and types the Telegram API response
   */
  private validateTelegramResponse(data: any): TelegramResponse {
    if (typeof data === 'object' && data !== null) {
      const response: TelegramResponse = {
        ok: Boolean(data.ok),
        result: data.result,
        description: data.description
      };
      return response;
    }
    throw new Error('Invalid Telegram API response');
  }

  /**
   * Handles Web3 token distribution if configured
   */
  private async handleTokenDistribution(score: GameScore): Promise<void> {
    // Implement Web3 token distribution logic here
    // This will vary based on the specific blockchain and contract
  }

  /**
   * Retrieves high score for a user
   */
  async getHighScore(userId: string): Promise<number | null> {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.config.botToken}/getGameHighScores`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            chat_id: this.lastGameContext.chatId,
            message_id: this.lastGameContext.messageId
          })
        }
      );

      const data = await response.json();
      const telegramResponse = this.validateTelegramResponse(data);
      
      if (telegramResponse.ok && Array.isArray(telegramResponse.result) && telegramResponse.result.length > 0) {
        return telegramResponse.result[0].score;
      }
      return null;
    } catch (error) {
      console.error('Error fetching high score:', error);
      return null;
    }
  }

  /**
   * Initializes a new game session
   */
  private async initializeGame(userId: string): Promise<{ chatId: string; messageId: string } | null> {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.config.botToken}/sendGame`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: userId,
            game_short_name: this.config.gameShortName
          })
        }
      );

      const data = await response.json();
      const telegramResponse = this.validateTelegramResponse(data);
      
      if (telegramResponse.ok && telegramResponse.result) {
        return {
          chatId: telegramResponse.result.chat.id.toString(),
          messageId: telegramResponse.result.message_id.toString()
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to initialize game:', error);
      return null;
    }
  }
}
