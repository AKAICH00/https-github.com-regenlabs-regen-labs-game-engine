import { Game } from 'phaser';
import { gameConfig } from './game/config';
import { GameSDK } from '@telegram-game-platform/sdk';

// Initialize SDK with configuration from environment
const sdk = new GameSDK({
  botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  gameShortName: import.meta.env.VITE_TELEGRAM_GAME_NAME
});

// Initialize game
const game = new Game(gameConfig);

// Make SDK available globally in the game
game.registry.set('sdk', sdk);
