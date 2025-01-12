"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainScene = void 0;
const phaser_1 = __importDefault(require("phaser"));
class MainScene extends phaser_1.default.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.velocity = { x: 200, y: 200 };
    }
    create() {
        // Create a ball
        this.ball = this.add.circle(400, 300, 10, 0xff0000);
        // Add click/tap handler
        this.input.on('pointerdown', () => {
            // Change ball color on tap
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            if (this.ball) {
                this.ball.setFillStyle(randomColor);
            }
        });
    }
    update() {
        if (!this.ball)
            return;
        // Move the ball
        this.ball.x += this.velocity.x * (this.game.loop.delta / 1000);
        this.ball.y += this.velocity.y * (this.game.loop.delta / 1000);
        // Bounce off walls
        if (this.ball.x < 0 || this.ball.x > 800) {
            this.velocity.x *= -1;
        }
        if (this.ball.y < 0 || this.ball.y > 600) {
            this.velocity.y *= -1;
        }
    }
}
exports.MainScene = MainScene;
