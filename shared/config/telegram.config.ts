import { z } from 'zod';

const telegramConfigSchema = z.object({
  botToken: z.string().min(1),
  gameShortName: z.string().min(1),
  webAppUrl: z.string().url(),
  localWebAppUrl: z.string().url().optional(),
  botUrl: z.string().url(),
});

export const TELEGRAM_CONFIG = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  gameShortName: process.env.GAME_SHORT_NAME || '',
  webAppUrl: process.env.GAME_URL || '',
  localWebAppUrl: process.env.LOCAL_GAME_URL,
  botUrl: `https://t.me/${process.env.BOT_USERNAME || ''}`,
};

try {
  telegramConfigSchema.parse(TELEGRAM_CONFIG);
} catch (error) {
  console.error('Invalid Telegram configuration:', error);
  throw error;
}

export type TelegramConfig = z.infer<typeof telegramConfigSchema>;
