--- a/game/src/game/config.ts
+++ b/game/src/game/config.ts
@@ -1,5 +1,6 @@
 import Phaser from 'phaser';
 import { MainScene } from './scenes/MainScene';
+import { telegramConfig } from '../../../../shared/config/telegram.config';
 
 export const gameConfig: Phaser.Types.Core.GameConfig = {
   type: Phaser.AUTO,
@@ -19,7 +20,10 @@
     default: 'arcade',
     arcade: {
       gravity: { x: 0, y: 0 },
-      debug: false
+      debug: process.env.NODE_ENV === 'development'
     }
   }
-}; 
+};
+
+export const gameShortName = telegramConfig.gameShortName;
