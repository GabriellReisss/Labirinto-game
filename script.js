class BaseGameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.score = 0;
        this.hasKey = false;
        this.enemies = [];
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('door', 'assets/door.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('tiles', 'assets/tileset.png');
        this.load.image('backgroundGame', 'assets/background_game.png');
    }

    create() {
        this.add.image(1140, 400, 'backgroundGame').setScale(5);
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset", "tiles");
        map.createLayer("Ground", tileset, 0, 0);
        
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        
        this.spawnKey();    
        this.door = this.physics.add.sprite( 1200, Phaser.Math.Between(100, 500), 'door');
        this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);
        
        this.spawnEnemies();

        this.score = this.registry.get('score') || 0;
        this.scoreText = this.add.text(16, 16, `Placar: ${this.score}`, { fontSize: '32px', fill: '#fff' });

        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.enemies, () => {
            this.registry.set('score', 0);
            this.scene.start('GameOverScene');
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.loadCustom();
        this.configureEnemy();
    }

    loadCustom() { }

    update() {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-300);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(300);
        }
    }

    spawnKey() {
        if (this.keyItem) {
            this.keyItem.destroy();
        }
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        this.keyItem = this.physics.add.sprite(x, y, 'key');
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.hasKey = false;
    }

    collectKey(player, key) {
        this.score += 10;
        this.registry.set('score', this.score);
        this.scoreText.setText(`Placar: ${this.score}`);
        key.destroy();
        this.hasKey = true;
    }

    spawnEnemies() {
        const enemySpeeds = [200, 300, 400];
        for (let i = 0; i < enemySpeeds.length; i++) {
            let enemy = this.physics.add.sprite(Phaser.Math.Between(300, 700), Phaser.Math.Between(100, 500), 'enemy');
            enemy.setVelocity(enemySpeeds[i], enemySpeeds[i]);
            enemy.setBounce(1.1, 1.1);
            enemy.setCollideWorldBounds(true);
            this.enemies.push(enemy);
        }
    }

    enterDoor(player, door) {
        if (this.hasKey) {
            this.scene.start(this.nextScene);
        }
    }

    configureEnemy() {
        const enemySpeeds = [200, 300, 400];
        for (var enemy of this.enemies) {
            enemy.setVelocity( enemySpeeds[Math.floor(Math.random() * enemySpeeds.length)], enemySpeeds[Math.floor(Math.random() * enemySpeeds.length)]);
            enemy.setBounce(1.1, 1.1);
            enemy.setCollideWorldBounds(true);
        }
    }
}

class GameScene extends BaseGameScene {
    constructor() {
        super("GameScene");
        this.nextScene = "GameScene2";
        
    }
}

class GameScene2 extends BaseGameScene {
    constructor() {
        super("GameScene2");
    }

    loadCustom() {
        this.enemies.push(this.physics.add.sprite(Phaser.Math.Between(300, 700), Phaser.Math.Between(100, 500), 'enemy'));
        this.enemies.push(this.physics.add.sprite(Phaser.Math.Between(300, 700), Phaser.Math.Between(100, 500), 'enemy'));
        this.enemies.push(this.physics.add.sprite(Phaser.Math.Between(300, 700), Phaser.Math.Between(100, 500), 'enemy'));
        this.nextScene = "GameScene3";
    }
}

class GameScene3 extends BaseGameScene {
    constructor() {
        super("GameScene3");
    }

    loadCustom() {
        this.enemies.push(this.physics.add.sprite(Phaser.Math.Between(300, 700), Phaser.Math.Between(100, 500), 'enemy'));
        this.enemies.push(this.physics.add.sprite(Phaser.Math.Between(300, 700), Phaser.Math.Between(100, 500), 'enemy'));
        this.enemies.push(this.physics.add.sprite(Phaser.Math.Between(300, 700), Phaser.Math.Between(100, 500), 'enemy'));
        this.nextScene = "WinScene";
    }
}

class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        this.load.image('startButton', 'assets/start.png');
        this.load.image('backgroundMenu', 'assets/background_menu.png');
    }

    create() {
        this.add.image(1160, 400, 'backgroundMenu').setScale(5);
        let startButton = this.add.image(650, 400, 'startButton').setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    preload() {
        this.load.image('backgroundGameOver', 'assets/background_gameover.png');
    }

    create() {
        this.add.image(1035, 400, 'backgroundGameOver').setScale(5);
        this.add.text(540, 300, "Game Over", { fontSize: "48px", fill: "#f00" });
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super("WinScene");
    }

    preload() {
        this.load.image('backgroundWin', 'assets/background_win.png');
    }

    create() {
        this.add.image(960, 400, 'backgroundWin').setScale(5);
        this.add.text(510, 300, "Parábens!", { fontSize: "48px", fill: "#0f0" });
        this.input.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1345,
    height: 635,
    physics: { default: 'arcade', arcade: { debug: false } },
    scene: [MenuScene, GameScene, GameScene2, GameScene3, GameOverScene, WinScene]
};

const game = new Phaser.Game(config);
