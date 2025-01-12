import { Scene } from 'phaser';
import { GameSDK, GameUser } from '@telegram-game-platform/sdk';
import { CircleManager } from '../utils/circleManager';
import { PatternGenerator } from '../utils/patternGenerator';
import { PatternValidator } from '../utils/patternValidator';
import { RewardSystem } from '../utils/rewardSystem';
import { UIManager } from '../utils/uiManager';
import { DifficultyMode, Pattern } from '../types';
import { GAME_CONFIG } from '../constants';
import { Logger } from '../../utils/Logger';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            username?: string;
          };
        };
      };
    };
  }
}

export class MainScene extends Scene {
  private circleManager!: CircleManager;
  private patternGenerator: typeof PatternGenerator;
  private patternValidator!: PatternValidator;
  private rewardSystem!: RewardSystem;
  private uiManager!: UIManager;
  private logger: Logger;
  private gameSDK: GameSDK;

  private level: number = 1;
  private score: number = 0;
  private difficulty: DifficultyMode = 'novice';
  private patterns: Pattern[] = [];
  private isPlaying: boolean = false;

  constructor() {
    super({ key: 'MainScene' });
    this.logger = new Logger('MainScene');
    this.gameSDK = new GameSDK({
      botToken: process.env.VITE_BOT_TOKEN || '',
      gameShortName: process.env.VITE_GAME_SHORT_NAME || ''
    });
    this.patternGenerator = PatternGenerator;
  }

  create() {
    const { width, height } = this.scale;

    // Initialize game components
    this.circleManager = new CircleManager(this, this.difficulty === 'expert');
    this.patternValidator = new PatternValidator();
    this.rewardSystem = new RewardSystem();
    this.uiManager = new UIManager(
      this,
      () => this.tryAgain(),
      () => this.returnToMenu()
    );

    // Create circles
    const circles = this.circleManager.createCircles(width, height);

    // Add tap handlers
    circles.forEach((circle: Phaser.GameObjects.GameObject, index: number) => {
      circle.on('pointerdown', () => this.handleTap(index));
    });

    // Start game
    this.startGame();

    // Handle resize
    this.scale.on('resize', this.handleResize, this);

    // Initialize user data from Telegram WebApp
    this.initializeUser();
  }

  private async initializeUser() {
    try {
      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (telegramUser) {
        this.logger.info('Telegram user:', telegramUser);
        await this.gameSDK.setUser({
          id: telegramUser.id.toString(),
          firstName: telegramUser.first_name,
          username: telegramUser.username
        } as GameUser);
      }
    } catch (error) {
      this.logger.error('Error initializing user:', error);
    }
  }

  private startGame() {
    this.level = 1;
    this.score = 0;
    this.isPlaying = true;
    this.patterns = [];
    this.generateNewPattern();
    this.uiManager.hideGameOver();
    this.uiManager.updateScores(this.rewardSystem.getTokenBalance(), this.score);
    this.uiManager.updateLevel(this.level);
  }

  private generateNewPattern() {
    if (!this.isPlaying) return;

    const pattern = PatternGenerator.generate(this.level, GAME_CONFIG.circleCount, this.difficulty)[0];
    this.patterns.push(pattern);
    this.patternValidator.startValidating(pattern);
    this.showPattern(pattern);
  }

  private showPattern(pattern: Pattern) {
    // Highlight the circle to tap
    const circles = this.circleManager.circles;
    const circle = circles[pattern.index];
    circle.playTapAnimation();
  }

  private handleTap(index: number) {
    if (!this.isPlaying || !this.patternValidator.isActive()) return;

    const isValid = this.patternValidator.validateTap(index);
    if (!isValid) {
      this.handleGameOver();
      return;
    }

    const pattern = this.patternValidator.getCurrentPattern();
    if (pattern && this.patternValidator.isActive()) {
      // Pattern is still active, continue
      return;
    }

    // Pattern completed successfully
    const reward = this.rewardSystem.calculateReward(this.level, true);
    this.score += reward;
    this.level++;

    this.uiManager.updateScores(this.rewardSystem.getTokenBalance(), this.score);
    this.uiManager.updateLevel(this.level);
    this.uiManager.showMessage(`+${reward} points!`);

    // Generate next pattern
    this.generateNewPattern();
  }

  private async handleGameOver() {
    this.isPlaying = false;
    this.uiManager.showGameOver();

    try {
      await this.gameSDK.submitScore(this.score);
      this.logger.info('Score submitted:', this.score);
    } catch (error) {
      this.logger.error('Error submitting score:', error);
    }
  }

  private tryAgain() {
    if (this.rewardSystem.deductTryAgainCost()) {
      this.startGame();
    } else {
      this.uiManager.showMessage('Not enough tokens!');
    }
  }

  private returnToMenu() {
    // Implement menu return logic
    this.logger.info('Returning to menu');
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    const width = gameSize.width;
    const height = gameSize.height;

    this.circleManager.resize(width, height);
    this.uiManager.resize(width, height);
  }
}
