import Phaser from 'phaser';
export declare class Circle extends Phaser.GameObjects.Container {
    private baseCircle;
    private rippleEffect;
    constructor(scene: Phaser.Scene, x: number, y: number, radius: number);
    destroy(): void;
}
