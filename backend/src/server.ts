const { Bot } = require('grammy');
const fastify = require('fastify');
const cors = require('@fastify/cors');
const rateLimit = require('@fastify/rate-limit');
const mongoose = require('mongoose');

console.log('Starting server initialization...');

// Define User schema
const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  lastName: String,
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// MongoDB connection function
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log('🔄 Attempting MongoDB connection...');
    
    // Enable mongoose debug mode
    mongoose.set('debug', true);
    
    // Log connection events
    mongoose.connection.on('connecting', () => {
      console.log('🟡 MongoDB: Connecting...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('🟢 MongoDB: Connected');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    await mongoose.connect(mongoUri, {
      dbName: 'soltap0'
    });
    
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    return false;
  }
};

// Initialize bot with token from environment
console.log('BOT_TOKEN:', process.env.BOT_TOKEN);
const bot = new Bot(process.env.BOT_TOKEN);

// Initialize Fastify server
console.log('Initializing Fastify server...');
const server = fastify();

// Add CORS and rate limiting
console.log('Registering CORS and rate limiting...');
server.register(cors);
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Handle /start command
bot.command('start', async (ctx) => {
  console.log('📱 Received /start command from user:', {
    userId: ctx.from.id,
    username: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name
  });
  
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log('🔄 MongoDB not connected (state:', mongoose.connection.readyState + '), attempting to reconnect...');
      await connectDB();
    }

    // Save or update user in MongoDB
    const userData = {
      telegramId: ctx.from.id,
      username: ctx.from.username,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
      lastActive: new Date()
    };

    console.log('💾 Attempting to save user data:', userData);
    const user = await User.findOneAndUpdate(
      { telegramId: ctx.from.id },
      { $set: userData },
      { upsert: true, new: true }
    );
    console.log('✅ User data saved/updated in MongoDB:', user);
  } catch (error) {
    console.error('❌ Error saving user data:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }

  await ctx.reply('Welcome! Use /play to start the game.');
});

// Handle /play command
bot.command('play', async (ctx) => {
  console.log('Received /play command from user:', ctx.from.id);
  const userId = ctx.from.id;
  const gameUrl = `${process.env.GAME_URL}?userId=${userId}`;
  
  console.log('Sending game message...');
  await ctx.replyWithGame(process.env.GAME_SHORT_NAME);
});

// Handle game callback queries
bot.on('callback_query:game_short_name', async (ctx) => {
  console.log('Received game callback query from user:', ctx.from.id);
  const userId = ctx.from.id;
  const gameUrl = `${process.env.GAME_URL}?userId=${userId}`;
  
  await ctx.answerCallbackQuery({
    url: gameUrl
  });
});

// API endpoint to verify user session
server.get('/api/verify-session', async (request, reply) => {
  console.log('Received session verification request for user:', request.query.userId);
  const { userId } = request.query;
  
  if (!userId) {
    console.log('No userId provided');
    return reply.code(400).send({ error: 'userId is required' });
  }

  // For testing, always return success
  console.log('Session verified for user:', userId);
  return { 
    verified: true,
    userId,
    session: {
      startTime: Date.now(),
      gameShortName: process.env.GAME_SHORT_NAME
    }
  };
});

// Start bot and server
async function start() {
  try {
    // Connect to MongoDB first
    console.log('Connecting to MongoDB...');
    await connectDB();

    // Then start the bot
    console.log('Starting bot...');
    await bot.start();
    console.log('Bot started successfully');

    // Finally start the server
    const port = process.env.PORT || 3000;
    console.log(`Starting server on port ${port}...`);
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
}

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Attempting to reconnect...');
  connectDB();
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

console.log('Calling start function...');
start();
