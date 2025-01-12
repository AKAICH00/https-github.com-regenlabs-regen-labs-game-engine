interface Environment {
  telegram: {
    gameShortName: string;
    botToken: string;
    botUsername: string;
  };
  app: {
    baseUrl: string;
    port: number;
    host: string;
    corsOrigins: string[];
    logLevel: string;
  };
}

const environment: Environment = {
  telegram: {
    gameShortName: process.env.GAME_SHORT_NAME || '',
    botToken: process.env.BOT_TOKEN || '',
    botUsername: process.env.BOT_USERNAME || ''
  },
  app: {
    baseUrl: process.env.BASE_URL || '',
    port: parseInt(process.env.PORT || '8090'),
    host: process.env.HOST || '0.0.0.0',
    corsOrigins: (process.env.CORS_ORIGINS || '').split(','),
    logLevel: process.env.LOG_LEVEL || 'info'
  }
};

export const validateEnvironment = (): void => {
  if (!environment.telegram.gameShortName) {
    throw new Error('Missing GAME_SHORT_NAME environment variable');
  }
  if (!environment.telegram.botToken) {
    throw new Error('Missing BOT_TOKEN environment variable');
  }
};

export default environment; 
