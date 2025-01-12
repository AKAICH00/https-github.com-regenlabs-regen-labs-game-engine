"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateManager = void 0;
class GameStateManager {
    constructor() {
        const initialRewards = {
            inGamePoints: 0,
            tokenPoints: 0,
            multiplier: 1
        };
        this.state = {
            currentScore: 0,
            currentRewards: initialRewards,
            sessionStartTime: Date.now(),
            lastUpdateTime: Date.now(),
            isActive: true
        };
    }
    setUser(user) {
        this.state.user = user;
    }
    getUser() {
        return this.state.user;
    }
    setScore(score) {
        this.state.currentScore = score;
        this.state.lastUpdateTime = Date.now();
    }
    getScore() {
        return this.state.currentScore;
    }
    setHighScore(score) {
        this.state.highScore = score;
    }
    getHighScore() {
        return this.state.highScore;
    }
    updateRewards(rewards) {
        this.state.currentRewards = rewards;
        this.state.lastUpdateTime = Date.now();
    }
    getCurrentRewards() {
        return this.state.currentRewards;
    }
    getSessionDuration() {
        return Date.now() - this.state.sessionStartTime;
    }
    endSession() {
        this.state.isActive = false;
        this.state.lastUpdateTime = Date.now();
    }
}
exports.GameStateManager = GameStateManager;
