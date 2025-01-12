```diff
--- a/README.md
+++ b/README.md
@@ -35,6 +35,7 @@
 # Development
 TELEGRAM_BOT_TOKEN=your_bot_token
 BASE_URL=http://localhost:8080
+MONGO_URI=mongodb://localhost:27017/soltap0
 GAME_SHORT_NAME=your_game_short_name
 GAME_URL=http://localhost:3000
 NODE_ENV=development
@@ -43,6 +44,7 @@
 TELEGRAM_BOT_TOKEN=your_bot_token
 BASE_URL=your-app.fly.dev
 GAME_SHORT_NAME=your_game_short_name
+MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/soltap0
 GAME_URL=https://your-app.fly.dev/game
 NODE_ENV=production
 ```
@@ -53,6 +55,7 @@
 2. Create `.env` file in bot directory with development settings
 3. Install dependencies:
 ```bash
+cd backend && npm install
 npm install
 ```
 
@@ -79,6 +82,7 @@
   BASE_URL="your-app.fly.dev" \
   GAME_URL="https://your-app.fly.dev/game" \
   GAME_SHORT_NAME="your_game_short_name" \
+  MONGO_URI="mongodb+srv://[username]:[password]@[cluster]/soltap0" \
   -a your-app-name
 ```
 
@@ -128,6 +132,13 @@
 - No trailing spaces in values
 
 ## Deployment Checklist
+
+### Doppler Setup
+
+1. [ ] Create a Doppler project (e.g., `regen-labs`)
+2. [ ] Create a `prd` configuration
+3. [ ] Add the following environment variables to the `prd` config:
+    -   `TELEGRAM_BOT_TOKEN`, `BASE_URL`, `GAME_URL`, `GAME_SHORT_NAME`, `MONGO_URI`
 
 1. [ ] All environment variables set
 2. [ ] Built and tested locally

```
