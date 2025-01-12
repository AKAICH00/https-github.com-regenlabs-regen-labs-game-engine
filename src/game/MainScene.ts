import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
    private ball?: Phaser.GameObjects.Arc;
    private velocity = { x: 200, y: 200 };

    constructor() {
        super({ key: 'MainScene' });
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
        if (!this.ball) return;

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
