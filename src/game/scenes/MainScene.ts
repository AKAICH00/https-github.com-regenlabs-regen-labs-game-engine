import Phaser from 'phaser';
import { GameSDK, GameConfig, GameRewards } from '@telegram-game-platform/sdk';

// Telegram WebApp type declarations
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe: {
          user?: {
            id: number;
            username?: string;
            first_name: string;
          };
        };
      };
    };
  }
}

export default class MainScene extends Phaser.Scene {
  private sdk: GameSDK;
  private currentRewards: GameRewards = {
    inGamePoints: 0,    // Raw tap points
    tokenPoints: 0,     // Converted SolTap score
    coins: 0,          // In-game coins
    multiplier: 1      // Score multiplier
  };

  constructor() {
    super({ key: 'MainScene' });
    
    // Initialize SDK with game configuration
    const config: GameConfig = {
      gameShortName: 'soltap',
      pointsToTokenRatio: 100,    // 100 tap points = 1 token
      minTokenThreshold: 1000,    // Need 1000 points to convert
      maxDailyTokens: 1000       // Max 1000 tokens per day
    };
    
    this.sdk = new GameSDK(config);
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Initialize game UI
    this.createGameUI(width, height);
    
    // Initialize user from Telegram WebApp
    this.initializeUser();
    
    // Setup tap interaction
    this.input.on('pointerdown', this.handleTap, this);
  }

  private createGameUI(width: number, height: number) {
    // Score display
    this.add.text(10, 10, 'Tap Points:', { font: '24px Arial', color: '#ffffff' });
    const pointsText = this.add.text(150, 10, '0', { font: '24px Arial', color: '#ffffff' });
    
    // Token display
    this.add.text(10, 40, 'Tokens:', { font: '24px Arial', color: '#ffffff' });
    const tokenText = this.add.text(150, 40, '0', { font: '24px Arial', color: '#ffffff' });
    
    // Tap area
    const tapZone = this.add.circle(width / 2, height / 2, 100, 0x00ff00, 0.5);
    tapZone.setInteractive();
    
    // Update UI when rewards change
    this.events.on('updateRewards', () => {
      pointsText.setText(this.currentRewards.inGamePoints.toString());
      tokenText.setText(this.currentRewards.tokenPoints.toString());
    });
  }

  private async initializeUser() {
    // Get user data from Telegram WebApp
    const webApp = window.Telegram?.WebApp;
    if (webApp?.initDataUnsafe?.user) {
      const { id, username, first_name } = webApp.initDataUnsafe.user;
      await this.sdk.setUser({
        id: id.toString(),
        username,
        firstName: first_name
      });
    }
  }

  private handleTap() {
    // Add points
    this.currentRewards.inGamePoints += 10;
    
    // Update multiplier based on consecutive taps
    // (You can implement your own multiplier logic)
    
    // Convert points to tokens if threshold reached
    if (this.currentRewards.inGamePoints >= 1000) {
      this.currentRewards.tokenPoints = Math.floor(this.currentRewards.inGamePoints / 100);
      this.submitScore();
    }
    
    // Emit event to update UI
    this.events.emit('updateRewards');
  }

  private async submitScore() {
    await this.sdk.submitScore({
      userId: this.sdk.getUser()?.id || '',
      score: this.currentRewards.tokenPoints,
      rewards: this.currentRewards,
      timestamp: Date.now(),
      level: 1  // Implement level tracking as needed
    });
  }

  update() {
    // Game loop updates here
  }
}
