"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSDK = void 0;
__exportStar(require("./lib/types"), exports);
__exportStar(require("./lib/api"), exports);
__exportStar(require("./lib/gameState"), exports);
const api_1 = require("./lib/api");
const gameState_1 = require("./lib/gameState");
class GameSDK {
    constructor(config) {
        this.api = new api_1.GameAPI(config);
        this.state = new gameState_1.GameStateManager();
    }
    setUser(user) {
        this.state.setUser(user);
    }
    async submitScore(score) {
        const user = this.state.getUser();
        if (!user) {
            throw new Error('User not set');
        }
        const rewards = this.state.getCurrentRewards();
        const gameScore = {
            score,
            userId: user.id,
            rewards,
            timestamp: Date.now()
        };
        const result = await this.api.submitScore(gameScore);
        if (result) {
            const highScore = await this.api.getHighScore(user.id);
            if (highScore !== null) {
                this.state.setHighScore(highScore);
            }
        }
        return result;
    }
    getScore() {
        return this.state.getScore();
    }
    getHighScore() {
        return this.state.getHighScore();
    }
    getUser() {
        return this.state.getUser();
    }
    getCurrentRewards() {
        return this.state.getCurrentRewards();
    }
    updateRewards(rewards) {
        this.state.updateRewards(rewards);
    }
}
exports.GameSDK = GameSDK;
