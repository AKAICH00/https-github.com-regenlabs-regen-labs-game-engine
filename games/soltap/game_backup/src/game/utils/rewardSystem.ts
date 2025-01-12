import { GAME_CONFIG } from '../constants';

export class RewardSystem {
  private tokenBalance: number;

  constructor() {
    this.tokenBalance = GAME_CONFIG.initialTokens;
  }

  calculateReward(level: number, isSuccess: boolean): number {
    if (!isSuccess) return 0;
    return Math.floor(GAME_CONFIG.baseReward * Math.pow(GAME_CONFIG.rewardMultiplier, level - 1));
  }

  deductTryAgainCost(): boolean {
    if (this.tokenBalance < GAME_CONFIG.tryAgainCost) {
      return false;
    }
    this.tokenBalance -= GAME_CONFIG.tryAgainCost;
    return true;
  }

  getTokenBalance(): number {
    return this.tokenBalance;
  }

  addTokens(amount: number) {
    this.tokenBalance += amount;
  }
}
