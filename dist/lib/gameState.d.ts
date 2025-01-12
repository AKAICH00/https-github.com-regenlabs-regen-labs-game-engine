import { GameUser, GameRewards } from './types';
export declare class GameStateManager {
    private state;
    constructor();
    setUser(user: GameUser): void;
    getUser(): GameUser | undefined;
    setScore(score: number): void;
    getScore(): number;
    setHighScore(score: number): void;
    getHighScore(): number | undefined;
    updateRewards(rewards: GameRewards): void;
    getCurrentRewards(): GameRewards;
    getSessionDuration(): number;
    endSession(): void;
}
