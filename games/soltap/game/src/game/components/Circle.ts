import Phaser from 'phaser';
import { COLORS } from '../constants';

export class Circle {
  private circle: Phaser.GameObjects.Arc;
  private scene: Phaser.Scene;
  private isActive: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
    this.scene = scene;
    this.circle = scene.add.circle(x, y, radius);
    this.circle.setStrokeStyle(3, parseInt(COLORS.PRIMARY.replace('#', ''), 16));
    this.circle.setFillStyle(parseInt(COLORS.PRIMARY.replace('#', ''), 16), 0.1);
    
    // Make circle interactive with proper hit area
    this.circle.setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains);
    
    // Add hover effects
    this.circle.on('pointerover', () => {
      if (!this.isActive) {
        this.circle.setStrokeStyle(3, parseInt(COLORS.SECONDARY.replace('#', ''), 16));
      }
    });
    
    this.circle.on('pointerout', () => {
      if (!this.isActive) {
        this.circle.setStrokeStyle(2, parseInt(COLORS.PRIMARY.replace('#', ''), 16));
      }
    });
  }

  async playTapAnimation() {
    if (this.isActive) return;
    this.isActive = true;

    const originalRadius = this.circle.radius;
    const originalStrokeColor = parseInt(COLORS.PRIMARY.replace('#', ''), 16);
    const highlightColor = parseInt(COLORS.SECONDARY.replace('#', ''), 16);

    // Flash animation
    this.circle.setStrokeStyle(2, highlightColor);
    this.circle.setFillStyle(highlightColor, 0.3);

    await new Promise(resolve => {
      this.scene.tweens.add({
        targets: this.circle,
        radius: originalRadius * 1.2,
        duration: 100,
        yoyo: true,
        onComplete: resolve
      });
    });

    // Reset to original state
    this.circle.setStrokeStyle(2, originalStrokeColor);
    this.circle.setFillStyle(0x000000, 0);
    this.circle.radius = originalRadius;
    this.isActive = false;
  }

  setPosition(x: number, y: number) {
    this.circle.setPosition(x, y);
    // Update hit area position
    this.circle.input?.hitArea.setPosition(x, y);
  }

  setRadius(radius: number) {
    this.circle.setRadius(radius);
    // Update interactive hit area
    this.circle.setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains);
  }

  getPosition(): { x: number; y: number } {
    return { x: this.circle.x, y: this.circle.y };
  }

  getGameObject(): Phaser.GameObjects.Arc {
    return this.circle;
  }
}
