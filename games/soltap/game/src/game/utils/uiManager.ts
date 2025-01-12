import { COLORS } from '../constants';

export class UIManager {
  private scene: Phaser.Scene;
  private scoreText: Phaser.GameObjects.Text;
  private tokenText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private messageText: Phaser.GameObjects.Text;
  private gameOverContainer: Phaser.GameObjects.Container;
  private tryAgainCallback: () => void;
  private menuCallback: () => void;

  constructor(scene: Phaser.Scene, tryAgainCallback: () => void, menuCallback: () => void) {
    this.scene = scene;
    this.tryAgainCallback = tryAgainCallback;
    this.menuCallback = menuCallback;

    // Create UI elements
    this.scoreText = scene.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      color: COLORS.TEXT
    });

    this.tokenText = scene.add.text(20, 50, 'Tokens: 0', {
      fontSize: '24px',
      color: COLORS.TEXT
    });

    this.levelText = scene.add.text(20, 80, 'Level: 1', {
      fontSize: '24px',
      color: COLORS.TEXT
    });

    this.messageText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '', {
      fontSize: '32px',
      color: COLORS.SUCCESS
    }).setOrigin(0.5);
    this.messageText.setVisible(false);

    // Create game over container
    this.gameOverContainer = this.createGameOverContainer();
    this.gameOverContainer.setVisible(false);
  }

  private createGameOverContainer(): Phaser.GameObjects.Container {
    const { width, height } = this.scene.scale;
    const container = this.scene.add.container(width / 2, height / 2);

    const gameOverText = this.scene.add.text(0, -100, 'Game Over!', {
      fontSize: '48px',
      color: COLORS.ERROR
    }).setOrigin(0.5);

    const tryAgainButton = this.scene.add.text(0, 0, 'Try Again', {
      fontSize: '32px',
      color: COLORS.PRIMARY
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', this.tryAgainCallback)
    .on('pointerover', () => tryAgainButton.setColor(COLORS.SECONDARY))
    .on('pointerout', () => tryAgainButton.setColor(COLORS.PRIMARY));

    const menuButton = this.scene.add.text(0, 50, 'Menu', {
      fontSize: '32px',
      color: COLORS.PRIMARY
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', this.menuCallback)
    .on('pointerover', () => menuButton.setColor(COLORS.SECONDARY))
    .on('pointerout', () => menuButton.setColor(COLORS.PRIMARY));

    container.add([gameOverText, tryAgainButton, menuButton]);
    return container;
  }

  updateScores(tokens: number, score: number) {
    this.tokenText.setText(`Tokens: ${tokens}`);
    this.scoreText.setText(`Score: ${score}`);
  }

  updateLevel(level: number) {
    this.levelText.setText(`Level: ${level}`);
  }

  showMessage(message: string) {
    this.messageText.setText(message);
    this.messageText.setVisible(true);
    this.scene.time.delayedCall(1000, () => {
      this.messageText.setVisible(false);
    });
  }

  showGameOver() {
    this.gameOverContainer.setVisible(true);
  }

  hideGameOver() {
    this.gameOverContainer.setVisible(false);
  }

  resize(width: number, height: number) {
    this.messageText.setPosition(width / 2, height / 2);
    this.gameOverContainer.setPosition(width / 2, height / 2);
  }
}
