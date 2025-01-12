import { GameScore, GameConfig } from './types';
/**
 * Handles all API interactions for the game platform
 * Includes both Telegram Bot API and game-specific endpoints
 */
export declare class GameAPI {
    private config;
    private lastGameContext;
    private tokenConfig;
    constructor(config: GameConfig);
    /**
     * Submits a game score with all associated rewards
     * Handles conversion of points to tokens based on configuration
     */
    submitScore(score: GameScore): Promise<boolean>;
    /**
     * Calculates token score based on in-game points
     */
    private calculateTokenScore;
    /**
     * Validates and initializes game context if needed
     */
    private validateGameContext;
    /**
     * Submits score to Telegram Bot API
     */
    private submitToTelegram;
    /**
     * Validates and types the Telegram API response
     */
    private validateTelegramResponse;
    /**
     * Handles Web3 token distribution if configured
     */
    private handleTokenDistribution;
    /**
     * Retrieves high score for a user
     */
    getHighScore(userId: string): Promise<number | null>;
    /**
     * Initializes a new game session
     */
    private initializeGame;
}
