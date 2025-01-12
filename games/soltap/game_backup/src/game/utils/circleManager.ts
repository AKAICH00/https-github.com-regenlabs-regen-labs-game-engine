import { Circle } from '../components/Circle';
import { GAME_CONFIG } from '../constants';

export class CircleManager {
  private scene: Phaser.Scene;
  private isExpertMode: boolean;
  private circles: Circle[] = [];

  constructor(scene: Phaser.Scene, isExpertMode: boolean) {
    this.scene = scene;
    this.isExpertMode = isExpertMode;
  }

  createCircles(width: number, height: number): Circle[] {
    const radius = Math.min(width, height) * 0.1;
    const centerX = width / 2;
    const centerY = height / 2;
    const distance = radius * 2.5;

    // Create circles in a square pattern
    const positions = [
      { x: centerX - distance, y: centerY - distance }, // Top left
      { x: centerX + distance, y: centerY - distance }, // Top right
      { x: centerX - distance, y: centerY + distance }, // Bottom left
      { x: centerX + distance, y: centerY + distance }  // Bottom right
    ];

    this.circles = positions.map(pos => new Circle(this.scene, pos.x, pos.y, radius));
    return this.circles;
  }

  resize(width: number, height: number) {
    const radius = Math.min(width, height) * 0.1;
    const centerX = width / 2;
    const centerY = height / 2;
    const distance = radius * 2.5;

    const positions = [
      { x: centerX - distance, y: centerY - distance },
      { x: centerX + distance, y: centerY - distance },
      { x: centerX - distance, y: centerY + distance },
      { x: centerX + distance, y: centerY + distance }
    ];

    this.circles.forEach((circle, index) => {
      circle.setPosition(positions[index].x, positions[index].y);
      circle.setRadius(radius);
    });
  }
}
