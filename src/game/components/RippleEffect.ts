import 'phaser';

export class RippleEffect extends Phaser.GameObjects.Container {
    private ripple: Phaser.GameObjects.Arc;

    constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
        super(scene, x, y);
        
        this.ripple = scene.add.arc(0, 0, radius, 0, 360, false, 0xffffff);
        this.ripple.setAlpha(0.5);
        
        this.add(this.ripple);
    }

    playRipple() {
        this.scene.tweens.add({
            targets: this.ripple,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.ripple.setScale(1);
                this.ripple.setAlpha(0.5);
            }
        });
    }
}
