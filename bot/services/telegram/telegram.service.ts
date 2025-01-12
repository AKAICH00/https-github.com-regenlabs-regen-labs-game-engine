--- a/bot/services/telegram/telegram.service.ts
+++ b/bot/services/telegram/telegram.service.ts
@@ -1,5 +1,6 @@
 import TelegramBot from 'node-telegram-bot-api';
 import { Logger } from '../../utils/Logger.js';
+import { telegramConfig } from '../../../shared/config/telegram.config.js';
 
 export class TelegramService {
   private static instance: TelegramService;
@@ -8,17 +9,7 @@
   private gameShortName: string;
 
   private constructor() {
-    const token = process.env.TELEGRAM_BOT_TOKEN;
-    if (!token) {
-      throw new Error('TELEGRAM_BOT_TOKEN is not set');
-    }
-
-    const baseUrl = process.env.BASE_URL;
-    if (!baseUrl) {
-      throw new Error('BASE_URL is not set');
-    }
-
-    const gameShortName = process.env.GAME_SHORT_NAME;
+    const { botToken: token, gameShortName, botUrl: baseUrl } = telegramConfig;
     if (!gameShortName) {
       throw new Error('GAME_SHORT_NAME is not set');
     }
