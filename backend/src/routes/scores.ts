import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { MongoClient, ObjectId } from 'mongodb';

interface ScoreUpdateBody {
  telegramId: string;
  tapPoints: number;
  solTapScore: number;
  coins: number;
  level: number;
  isPerfect: boolean;
}

interface UserScore {
  _id: ObjectId;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  scores: {
    tapPoints: number;
    solTapScore: number;
    coins: number;
  };
  gameStats: {
    highestLevel: number;
    perfectPatterns: number;
    totalGamesPlayed: number;
    lastPlayedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default async function scoreRoutes(fastify: FastifyInstance) {
  const client: MongoClient = fastify.mongo;
  const db = client.db('soltap0');
  const collection = db.collection<UserScore>('scores');

  // Update user's score
  fastify.post('/update', async (request: FastifyRequest<{ Body: ScoreUpdateBody }>, reply: FastifyReply) => {
    try {
      const { telegramId, tapPoints, solTapScore, coins, level, isPerfect } = request.body;

      const result = await collection.findOneAndUpdate(
        { telegramId },
        {
          $set: {
            'scores.tapPoints': tapPoints,
            'scores.solTapScore': solTapScore,
            'scores.coins': coins,
            'gameStats.lastPlayedAt': new Date(),
            updatedAt: new Date()
          },
          $max: { 'gameStats.highestLevel': level },
          $inc: { 
            'gameStats.totalGamesPlayed': 1,
            'gameStats.perfectPatterns': isPerfect ? 1 : 0
          }
        },
        { upsert: true, returnDocument: 'after' }
      );

      if (!result.value) {
        return reply.status(500).send({
          success: false,
          error: 'Failed to update score'
        });
      }

      return reply.send({
        success: true,
        data: result.value
      });
    } catch (error) {
      console.error('Error updating score:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to update score'
      });
    }
  });

  // Get user's scores
  fastify.get('/:telegramId', async (request: FastifyRequest<{ Params: { telegramId: string } }>, reply: FastifyReply) => {
    try {
      const { telegramId } = request.params;
      
      const userScore = await collection.findOne({ telegramId });
      if (!userScore) {
        return reply.status(404).send({
          success: false,
          error: 'User not found'
        });
      }

      return reply.send({
        success: true,
        data: userScore
      });
    } catch (error) {
      console.error('Error fetching score:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch score'
      });
    }
  });

  // Get top scores
  fastify.get('/leaderboard/top', async (request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) => {
    try {
      const limit = request.query.limit || 10;
      
      const topScores = await collection.find()
        .sort({ 'scores.solTapScore': -1 })
        .limit(limit)
        .project<UserScore>({
          telegramId: 1,
          username: 1,
          firstName: 1,
          'scores.solTapScore': 1,
          'gameStats.highestLevel': 1
        })
        .toArray();

      return reply.send({
        success: true,
        data: topScores
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch leaderboard'
      });
    }
  });
} 
