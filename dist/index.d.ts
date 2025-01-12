export * from './lib/types';
export * from './lib/api';
export * from './lib/gameState';
import { GameConfig, GameUser, GameRewards } from './lib/types';
export declare class GameSDK {
    private api;
    private state;
    constructor(config: GameConfig);
    setUser(user: GameUser): void;
    submitScore(score: number): Promise<boolean>;
    getScore(): number;
    getHighScore(): number | undefined;
    getUser(): GameUser | undefined;
    getCurrentRewards(): GameRewards;
    updateRewards(rewards: GameRewards): void;
}
