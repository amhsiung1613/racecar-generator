class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // loading bar
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 // reset fill/line style
            loadingBar.fillStyle(0xFFFFFF, 1);                  // (color, alpha)
            loadingBar.fillRect(0, centerY, w * value, 5);  // (x, y, w, h)
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        this.load.path = './assets/';
        // load graphics assets
        this.load.spritesheet('slime', 'slime-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
         this.load.image('platform', 'img/paddle.png');
        // this.load.image('fragment', 'img/fragment.png');
        this.load.image('particle', 'img/particle.png');
        this.load.image('ground', 'img/ground.png');
        this.load.image('foreground', 'img/foreground_buildings.png');
        this.load.image('midground', 'img/midground_buildings.png');
        this.load.image('background', 'img/background_buildings.png');
        this.load.image('nightSky', 'img/night_sky.png');
        // load audio assets
        this.load.audio('beats', ['audio/beats.mp3']);
        this.load.audio('clang', ['audio/clang.mp3']);
        this.load.audio('death', ['audio/death.mp3']);
        // load font
        this.load.bitmapFont('gem', 'font/gem.png', 'font/gem.xml');

    }

    create() {
        //slime run animation
        this.anims.create({
            key: 'run',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 7}),
        })

        //slime jump animation
        this.anims.create({
            key: 'jump',
            framerate: 1,
            repeat: 0,
            frames: this.anims.generateFrameNumbers('slime', {start: 8, end: 15}),
        })
        // check for local storage browser support
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }

        // go to Title scene
        this.scene.start('titleScene');
    }
}