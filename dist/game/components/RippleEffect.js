"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RippleEffect = void 0;
require("phaser");
class RippleEffect extends Phaser.GameObjects.Container {
    constructor(scene, x, y, radius) {
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
exports.RippleEffect = RippleEffect;
