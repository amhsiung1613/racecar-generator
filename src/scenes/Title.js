class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        // Set up necessary variables
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const textSpacer = 64;

        // Add title screen text
        let title01 = this.add.bitmapText(centerX, centerY, 'gem', '2-D Racer', 64).setOrigin(0.5).setTint(0xff0000);
        let title02 = this.add.bitmapText(centerX, centerY, 'gem', '2-D Racer', 64).setOrigin(0.5).setTint(0xff00ff).setBlendMode('SCREEN');
        // let title03 = this.add.bitmapText(centerX, centerY, 'gem', 'Slime Jump', 64).setOrigin(0.5).setTint(0xffff00).setBlendMode('ADD');
       
        // this.add.bitmapText(centerX, centerY + textSpacer, 'gem', 'Use the SPACE BAR to dodge obstacles', 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer * 3, 'gem', 'Press SPACE to Start', 36).setOrigin(0.5);
        // this.add.bitmapText(centerX, h - textSpacer, 'gem', 'Amber Hsiung Winter 2024', 16).setOrigin(0.5);

        // Title text tween
        this.tweens.add({
            targets: title01,
            duration: 2500,
            angle: { from: -1, to: 1 },
            yoyo: true,
            repeat: -1,
            onYoyo: () => {
                this.cameras.main.shake(100, 0.0025);
            }
        });
        this.tweens.add({
            targets: title02,
            duration: 2500,
            angle: { from: 1, to: -1 },
            yoyo: true,
            repeat: -1,
            onRepeat: () => {
                this.cameras.main.shake(100, 0.0025);
            }
        });

        // this.sound.play('intro', { volume: 0.5 });

        // Set up cursor keys
        this.keys = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Check for SPACE input
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            // Start next scene
            this.scene.start('playScene');
        }
    }
}
