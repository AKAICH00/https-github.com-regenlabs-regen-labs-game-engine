import Phaser from 'phaser';
import { COLORS } from '../constants';

export class Circle {
  private circle: Phaser.GameObjects.Arc;
  private scene: Phaser.Scene;
  private isActive: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
    this.scene = scene;
    this.circle = scene.add.circle(x, y, radius, 0x000000, 0);
    this.circle.setStrokeStyle(2, parseInt(COLORS.PRIMARY.replace('#', ''), 16));
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

  isPointInside(x: number, y: number): boolean {
    const distance = Phaser.Math.Distance.Between(
      x,
      y,
      this.circle.x,
      this.circle.y
    );
    return distance <= this.circle.radius;
  }

  setPosition(x: number, y: number) {
    this.circle.setPosition(x, y);
  }

  getPosition(): { x: number; y: number } {
    return { x: this.circle.x, y: this.circle.y };
  }

  setRadius(radius: number) {
    this.circle.radius = radius;
  }
}
