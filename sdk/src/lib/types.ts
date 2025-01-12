/**
 * Core types for the Telegram Game Platform SDK
 * Designed for Web3 tap-to-earn games with multiple reward systems
 */

/**
 * Represents a game user with both Telegram and game-specific data
 */
export interface GameUser {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  chatId?: string;
  messageId?: string;
  walletAddress?: string;  // Optional Web3 wallet address
}

/**
 * Represents the various types of rewards a player can earn
 * Each game should implement the relevant reward types
 */
export interface GameRewards {
  // Core reward types for tap-to-earn games
  inGamePoints: number;     // Raw points earned through gameplay (e.g., tapPoints)
  tokenPoints: number;      // Points that can be converted to tokens (e.g., solTapScore)
  
  // Optional reward types
  coins?: number;          // In-game currency
  multiplier?: number;     // Score multiplier if applicable
  combo?: number;          // Combo counter if applicable
  streak?: number;         // Daily/weekly streak if applicable
  
  // Game-specific rewards - extend as needed
  [key: string]: number | undefined;
}

/**
 * Represents a game score submission with all reward types
 */
export interface GameScore {
  userId: string;
  chatId?: string;
  messageId?: string;
  
  // Core scoring
  score: number;           // Main score for Telegram (usually tokenPoints)
  rewards: GameRewards;    // Detailed breakdown of all rewards
  
  // Optional metadata
  timestamp?: number;
  gameVersion?: string;
  difficulty?: string;
  level?: number;
}

/**
 * Represents the current state of a game session
 */
export interface GameState {
  user?: GameUser;
  currentScore: number;
  highScore?: number;
  chatId?: string;
  messageId?: string;
  
  // Game session data
  currentRewards: GameRewards;
  sessionStartTime: number;
  lastUpdateTime: number;
  
  // Optional game state
  currentLevel?: number;
  difficulty?: string;
  isActive: boolean;
}

/**
 * Configuration for the game SDK
 */
export interface GameConfig {
  botToken: string;
  gameShortName: string;
  baseUrl: string;
  
  // Game-specific settings
  pointsToTokenRatio?: number;     // How many points = 1 token
  minTokenThreshold?: number;      // Minimum points needed for token conversion
  maxDailyTokens?: number;        // Maximum tokens per day if applicable
  
  // Web3 configuration if needed
  web3Provider?: string;
  contractAddress?: string;
}

/**
 * Standard response format for Telegram API calls
 */
export interface TelegramResponse {
  ok: boolean;
  result?: any;
  description?: string;
}

/**
 * Conversion settings for points to tokens
 */
export interface TokenConversionConfig {
  ratio: number;              // Points to token ratio
  minThreshold: number;       // Minimum points needed
  maxDaily?: number;          // Max daily tokens
  cooldown?: number;         // Time between conversions
}

/**
 * Game session metrics for analytics
 */
export interface GameMetrics {
  sessionDuration: number;
  pointsEarned: number;
  tokensEarned: number;
  levelsCompleted: number;
  attempts: number;
  successRate: number;
}
