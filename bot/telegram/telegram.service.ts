import TelegramBot from 'node-telegram-bot-api';
import { TELEGRAM_CONFIG } from '../../config/telegram.config.js';
import { Logger } from '../../utils/Logger.js';

interface TelegramError extends Error {
  code?: string;
  response?: {
    statusCode?: number;
  };
}

const logger = new Logger('TelegramService');

/**
 * Singleton service for handling Telegram bot operations
 */
export class TelegramService {
  private static instance: TelegramService;
  private bot: TelegramBot;
  private logger: Logger;
  private useLocalUrl: boolean;

  private constructor(useLocalUrl: boolean = false) {
    this.logger = logger;
    this.useLocalUrl = useLocalUrl;

    // In production, use webhook. In development, use polling.
    const options: TelegramBot.ConstructorOptions = {
      webHook: process.env.NODE_ENV === 'production' ? {
        port: Number(process.env.PORT || 3000)
      } : undefined,
      polling: process.env.NODE_ENV !== 'production'
    };

    this.bot = new TelegramBot(TELEGRAM_CONFIG.botToken, options);

    // Set up webhook only in production
    if (process.env.NODE_ENV === 'production') {
      // Try to get the base URL from various sources
      const baseUrl = process.env.BASE_URL || TELEGRAM_CONFIG.webAppUrl || 'https://sol-tap-v2-stable-production.up.railway.app';
      const webhookUrl = `${baseUrl}/api/webhook`;
      this.bot.setWebHook(webhookUrl).then(() => {
        this.logger.info('Webhook set successfully:', webhookUrl);
      }).catch(error => {
        this.logger.error('Failed to set webhook:', error);
      });
    } else {
      // In development, ensure webhook is deleted
      this.bot.deleteWebHook().then(() => {
        this.logger.info('Webhook deleted for development mode');
      }).catch(error => {
        this.logger.error('Failed to delete webhook:', error);
      });
    }

    this.setupEventHandlers();
  }

  public static getInstance(useLocalUrl: boolean = false): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService(useLocalUrl);
    }
    return TelegramService.instance;
  }

  private getGameUrl(): string {
    if (this.useLocalUrl && TELEGRAM_CONFIG.localWebAppUrl) {
      this.logger.info('Using local game URL:', TELEGRAM_CONFIG.localWebAppUrl);
      return TELEGRAM_CONFIG.localWebAppUrl;
    }
    return TELEGRAM_CONFIG.webAppUrl;
  }

  private setupEventHandlers() {
    this.bot.on('error', (error) => {
      this.logger.error('Telegram Bot Error:', error);
    });

    this.bot.on('polling_error', (error: TelegramError) => {
      if (error.code === 'ETELEGRAM' && error.response?.statusCode === 409) {
        this.logger.warn('Polling conflict detected, stopping current polling...');
        this.bot.stopPolling()
          .then(() => {
            this.logger.info('Polling stopped, waiting before retry...');
            setTimeout(() => {
              this.logger.info('Retrying bot initialization...');
              this.bot.startPolling()
                .catch(err => this.logger.error('Error restarting polling:', err));
            }, 5000);
          })
          .catch(err => this.logger.error('Error stopping polling:', err));
      } else {
        this.logger.error('Telegram Polling Error:', error);
      }
    });

    this.setupCommands();
  }

  private setupCommands() {
    this.bot.onText(/\/start/, async (msg) => {
      try {
        await this.bot.sendGame(msg.chat.id, TELEGRAM_CONFIG.gameShortName);
        this.logger.info('Sent game to chat:', msg.chat.id);
      } catch (error) {
        this.logger.error('Error sending game:', error);
        await this.bot.sendMessage(msg.chat.id, 'Sorry, there was an error starting the game.');
      }
    });

    this.bot.on('callback_query', (query) => {
      if (query.game_short_name === TELEGRAM_CONFIG.gameShortName) {
        const gameUrl = this.getGameUrl();
        this.logger.info(`Opening game with URL: ${gameUrl}`);
        this.bot.answerCallbackQuery(query.id, {
          url: `${gameUrl}?userId=${query.from.id}`,
        });
      }
    });
  }

  async updateScore(userId: number, score: number): Promise<void> {
    try {
      await this.bot.setGameScore(userId, score, { force: true });
    } catch (error) {
      this.logger.error('Error updating score:', error);
      throw error;
    }
  }

  async getHealth(): Promise<any> {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Telegram health check timed out')), 5000);
      });

      const botInfo = await Promise.race([
        this.bot.getMe(),
        timeoutPromise
      ]);

      return {
        status: 'ok',
        game: TELEGRAM_CONFIG.gameShortName,
        telegram: {
          connected: true,
          botInfo,
          gameUrl: this.getGameUrl(),
          botToken: TELEGRAM_CONFIG.botToken ? '✓ Set' : '✗ Missing',
          mode: process.env.NODE_ENV === 'production' ? 'webhook' : 'polling',
          port: process.env.PORT ? Number(process.env.PORT) : 3001,
          baseUrl: process.env.BASE_URL || TELEGRAM_CONFIG.webAppUrl || 'https://sol-tap-v2-stable-production.up.railway.app',
          usingLocalUrl: this.useLocalUrl
        }
      };
    } catch (error: any) {
      this.logger.error('Telegram health check failed:', error);
      return {
        status: 'error',
        telegram: {
          connected: false,
          error: error.message
        }
      };
    }
  }

  async handleUpdate(update: TelegramBot.Update): Promise<void> {
    try {
      this.logger.info('Processing webhook update:', update);
      await this.bot.processUpdate(update);
    } catch (error) {
      this.logger.error('Error processing webhook update:', error);
      throw error;
    }
  }
}
