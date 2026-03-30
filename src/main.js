import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // Create player texture (blue circle)
        let graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x0000ff);
        graphics.fillCircle(16, 16, 16);
        graphics.generateTexture('player', 32, 32);

        // Create grid texture
        graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.lineStyle(1, 0x555555, 1);
        graphics.strokeRect(0, 0, 64, 64);
        graphics.generateTexture('grid', 64, 64);
    }

    create() {
        // Add infinite background (TileSprite)
        this.grid = this.add.tileSprite(0, 0, 4000, 4000, 'grid');
        this.grid.setOrigin(0.5, 0.5);

        // Add player
        this.player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'player');
        this.player.setCollideWorldBounds(false);

        // Camera setup
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.playerSpeed = 200;
    }

    update() {
        // Keep background following player (to appear infinite)
        this.grid.x = this.player.x;
        this.grid.y = this.player.y;
        this.grid.setTilePosition(this.player.x, this.player.y);

        // Reset velocity
        this.player.setVelocity(0);

        let moveX = 0;
        let moveY = 0;

        // Check horizontal movement
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            moveX = -1;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            moveX = 1;
        }

        // Check vertical movement
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            moveY = -1;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            moveY = 1;
        }

        // Normalize movement and set velocity
        if (moveX !== 0 || moveY !== 0) {
            const vector = new Phaser.Math.Vector2(moveX, moveY).normalize().scale(this.playerSpeed);
            this.player.setVelocity(vector.x, vector.y);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
