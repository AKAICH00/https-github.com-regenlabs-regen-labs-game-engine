import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createServer } from 'http';
import express from 'express';
import request from 'supertest';

describe('Telegram Bot Integration', () => {
  let app: express.Application;
  let server: any;

  beforeEach(() => {
    app = express();
    server = createServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('should handle /start command', async () => {
    const mockUpdate = {
      message: {
        chat: { id: 123456 },
        text: '/start'
      }
    };

    const response = await request(app)
      .post('/webhook')
      .send(mockUpdate);

    expect(response.status).toBe(200);
  });

  it('should handle game initialization', async () => {
    const mockGameRequest = {
      callback_query: {
        from: { id: 123456 },
        game_short_name: 'your_game'
      }
    };

    const response = await request(app)
      .post('/webhook')
      .send(mockGameRequest);

    expect(response.status).toBe(200);
  });

  it('should validate game score submission', async () => {
    const mockScore = {
      user_id: 123456,
      score: 100,
      game_short_name: 'your_game'
    };

    const response = await request(app)
      .post('/submit-score')
      .send(mockScore);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success');
  });
});
