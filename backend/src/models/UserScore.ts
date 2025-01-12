import mongoose, { Document } from 'mongoose';

interface IUserScore extends Document {
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

const userScoreSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    index: true
  },
  username: String,
  firstName: String,
  lastName: String,
  scores: {
    tapPoints: {
      type: Number,
      default: 0
    },
    solTapScore: {
      type: Number,
      default: 0
    },
    coins: {
      type: Number,
      default: 0
    }
  },
  gameStats: {
    highestLevel: {
      type: Number,
      default: 1
    },
    perfectPatterns: {
      type: Number,
      default: 0
    },
    totalGamesPlayed: {
      type: Number,
      default: 0
    },
    lastPlayedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
userScoreSchema.pre('save', function(this: IUserScore, next: () => void) {
  this.updatedAt = new Date();
  next();
});

export const UserScore = mongoose.model<IUserScore>('UserScore', userScoreSchema);
