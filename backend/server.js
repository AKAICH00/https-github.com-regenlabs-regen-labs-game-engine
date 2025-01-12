--- a/backend/server.js
+++ b/backend/server.js
@@ -3,6 +3,8 @@
 import cors from '@fastify/cors';
 import rateLimit from '@fastify/rate-limit';
 import { MongoClient } from 'mongodb';
+import { appConfig } from '../shared/config/app.config.js';
+import { telegramConfig } from '../shared/config/telegram.config.js';
 
 // Parse command line arguments
 const useLocalUrl = process.argv.includes('--local');
@@ -18,12 +20,12 @@
 const connectDB = async () => {
   try {
     console.log('Attempting to connect to MongoDB...');
-    
-    if (!process.env.MONGO_URI) {
+
+    if (!appConfig.dbUri) {
       throw new Error('MONGO_URI environment variable is not set');
     }
 
-    const uri = process.env.MONGO_URI;
+    const uri = appConfig.dbUri;
     console.log('Connecting to MongoDB with URI pattern:', uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://$1:****@'));
     
     const client = new MongoClient(uri, {
@@ -34,7 +36,7 @@
     });
 
     console.log('Attempting to establish connection...');
-    await client.connect();
+    await client.connect();    
     console.log('Connected to MongoDB, testing connection with ping...');
     await client.db("admin").command({ ping: 1 });
     console.log("✅ Successfully connected to MongoDB!");
@@ -58,7 +60,7 @@
       throw new Error('MongoDB client not initialized');
     }
 
-    const db = global.mongoClient.db('soltap0');
+    const db = global.mongoClient.db(appConfig.dbName);
     const users = db.collection('users');
     
     const result = await users.updateOne(
@@ -99,8 +101,8 @@
     // First try to connect to MongoDB
     await connectDB();
     
-    console.log('BOT_TOKEN:', process.env.BOT_TOKEN);
-    const bot = new Bot(process.env.BOT_TOKEN);
+    console.log('BOT_TOKEN:', telegramConfig.botToken);
+    const bot = new Bot(telegramConfig.botToken);
 
     // Add error handler
     bot.catch((err) => {
@@ -129,7 +131,7 @@
         const userId = ctx.from.id;
         const gameUrl = `${useLocalUrl ? `https://${process.env.LOCAL_GAME_URL}` : process.env.GAME_URL}?userId=${userId}`;
         
-        console.log('Sending game message...');
+        console.log('Sending game message...', gameUrl);
         await ctx.replyWithGame(process.env.GAME_SHORT_NAME);
       } catch (error) {
         console.error('❌ Error in /play command:', error);
@@ -162,7 +164,7 @@
     console.log('Bot started successfully');
 
     // Start the server
-    const port = process.env.PORT || 3000;
+    const port = appConfig.port;
     await server.listen({ port, host: '0.0.0.0' });
     console.log(`Server listening on port ${port}`);
 
@@ -218,7 +220,7 @@
     await connectDB();
 
     // Then start the bot
-    console.log('Starting bot...');
+    console.log('Starting bot with token:', process.env.BOT_TOKEN);
     await bot.start();
     console.log('Bot started successfully');
