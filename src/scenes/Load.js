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

        //loading assets
        this.load.path = './assets/';
        // load graphics assets
        // this.load.image('name', 'img/path.png');
        this.load.image('car', 'img/car.png');
        this.load.image('corner', 'img/corner_track.png');
        this.load.image('long', 'img/long_track.png');
        this.load.image('med', 'img/med_track.png');
        this.load.image('short', 'img/short_track.png');

        // load audio assets
        // this.load.audio('name', ['audio/music.mp3']);
        
        // load font
        this.load.bitmapFont('gem', 'font/gem.png', 'font/gem.xml');

    }

    create() {
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