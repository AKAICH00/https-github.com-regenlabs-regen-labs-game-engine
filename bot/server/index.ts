--- a/bot/server/index.ts
+++ b/bot/server/index.ts
@@ -4,6 +4,7 @@
 import path from 'path';
 import { fileURLToPath } from 'url';
 import { TelegramService } from '../services/telegram/telegram.service.js';
+import { appConfig } from '../../shared/config/app.config.js';
 import { Logger } from '../utils/Logger.js';
 
 const __filename = fileURLToPath(import.meta.url);
@@ -12,15 +13,6 @@
 
 const app = express();
 const router = Router();
-const logger = new Logger('Server');
-
-// Parse command line arguments
-const useLocalUrl = process.argv.includes('--local');
-if (useLocalUrl) {
-  logger.info('Using local game URL from LOCAL_GAME_URL');
-  if (!process.env.LOCAL_GAME_URL) {
-    logger.error('LOCAL_GAME_URL is not set in environment variables');
-    process.exit(1);
-  }
 }
 
 // Validate required environment variables
@@ -30,7 +22,7 @@
 }
 
 // Initialize Telegram bot service with local flag
-const telegramService = TelegramService.getInstance(useLocalUrl);
+const telegramService = TelegramService.getInstance();
 
 // Middleware
 app.use((req: Request, res: Response, next: Function) => {
@@ -100,10 +92,9 @@
 app.use('/api', router);
 
 // Start server
-const PORT = parseInt(process.env.PORT || '8080', 10);
-const server = app.listen(PORT, '0.0.0.0', () => {
-  logger.info(`Server running at http://0.0.0.0:${PORT}`);
-  logger.info('Environment:', process.env.NODE_ENV || 'production');
+const server = app.listen(appConfig.port, appConfig.host, () => {
+  logger.info(`Server running at http://${appConfig.host}:${appConfig.port}`);
+  logger.info('Environment:', appConfig.isProduction ? 'production' : 'development');
   logger.info('Static files directory:', DIST_DIR);
 });
