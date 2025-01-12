import Phaser from 'phaser';
import { RippleEffect } from '../effects/RippleEffect';

export class Circle extends Phaser.GameObjects.Container {
    private baseCircle: Phaser.GameObjects.Arc;
    private rippleEffect: RippleEffect;

    constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
        super(scene, x, y);
        
        this.baseCircle = scene.add.arc(0, 0, radius, 0, 360, false, 0xffffff);
        this.rippleEffect = new RippleEffect(scene, x, y);
        
        this.add(this.baseCircle);
        this.setSize(radius * 2, radius * 2);
        
        this.baseCircle.setInteractive();
        this.baseCircle.on('pointerdown', () => {
            this.rippleEffect.play();
            this.emit('tap');
        });
    }

    destroy() {
        this.rippleEffect.destroy();
        super.destroy();
    }
}
