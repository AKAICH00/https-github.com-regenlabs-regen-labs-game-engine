"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Circle = void 0;
const phaser_1 = __importDefault(require("phaser"));
const RippleEffect_1 = require("../effects/RippleEffect");
class Circle extends phaser_1.default.GameObjects.Container {
    constructor(scene, x, y, radius) {
        super(scene, x, y);
        this.baseCircle = scene.add.arc(0, 0, radius, 0, 360, false, 0xffffff);
        this.rippleEffect = new RippleEffect_1.RippleEffect(scene, x, y);
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
exports.Circle = Circle;
