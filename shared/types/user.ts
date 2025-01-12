import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserScore {
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
