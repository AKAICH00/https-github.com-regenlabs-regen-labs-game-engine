import { z } from 'zod';
import { LogLevel } from '../utils/logger';

// Define the schema for environment variables using Zod
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  LOG_LEVEL: z.nativeEnum(LogLevel).default(LogLevel.INFO),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  CORS_ORIGINS: z.string().optional(),
  MONGO_URI: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  GAME_SHORT_NAME: z.string().min(1),
  GAME_URL: z.string().url(),
  LOCAL_GAME_URL: z.string().url().optional(),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

// Derive additional configuration based on environment variables
const isProduction = env.NODE_ENV === 'production';
const isDevelopment = env.NODE_ENV === 'development';
const isTest = env.NODE_ENV === 'test';

// Define the application configuration
export const appConfig = {
  logLevel: env.LOG_LEVEL,
  port: env.PORT,
  host: env.HOST,
  corsOrigins: env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',') : [],
  dbUri: env.MONGO_URI,
  dbName: env.DATABASE_NAME,
  isProduction,
  isDevelopment,
  isTest,
};

export type AppConfig = typeof appConfig;
