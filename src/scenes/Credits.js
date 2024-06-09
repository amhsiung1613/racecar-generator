class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }

    create() {
        console.log('Credits scene started'); // Log to confirm scene is starting

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const textSpacer = 64;

        // Add credits text
        this.add.bitmapText(centerX, centerY, 'edit', 'Credits', 64).setOrigin(0.5);
        console.log('Credits text added'); // Log to confirm bitmap text is added

        this.add.bitmapText(centerX, centerY + textSpacer, 'edit', 'Game Developer: Jacob, Amber, Daniel, Ethan, Quinlan', 32).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer * 2, 'edit', 'Press LEFT ARROW to Return', 24).setOrigin(0.5);

        this.keys = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.left)) {
            this.scene.start('titleScene');
        }
    }
}