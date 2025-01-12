import Phaser from 'phaser';
declare global {
    interface Window {
        Telegram?: {
            WebApp?: {
                initDataUnsafe: {
                    user?: {
                        id: number;
                        username?: string;
                        first_name: string;
                    };
                };
            };
        };
    }
}
export default class MainScene extends Phaser.Scene {
    private sdk;
    private currentRewards;
    constructor();
    create(): void;
    private createGameUI;
    private initializeUser;
    private handleTap;
    private submitScore;
    update(): void;
}
