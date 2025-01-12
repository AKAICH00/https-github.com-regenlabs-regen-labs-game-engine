import 'phaser';
export declare class RippleEffect extends Phaser.GameObjects.Container {
    private ripple;
    constructor(scene: Phaser.Scene, x: number, y: number, radius: number);
    playRipple(): void;
}
