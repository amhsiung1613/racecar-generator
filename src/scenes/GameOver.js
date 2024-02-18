class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        // check for high score in local storage
        // uncomment console.log statements if you need to debug local storage
        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
            //console.log(`storedScore: ${storedScore}`);
            // see if current score is higher than stored score
            if(level > storedScore) {
                //console.log(`New high score: ${level}`);
                localStorage.setItem('hiscore', level.toString());
                highScore = level;
                newHighScore = true;
            } else {
                //console.log('No new high score :/');
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }
        } else {
            //console.log('No high score stored. Creating new.');
            highScore = level;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }

        // add GAME OVER text
        if(newHighScore) {
            this.add.bitmapText(centerX, centerY - textSpacer*3, 'gem', 'New Hi-Score!', 32).setOrigin(0.5);
        }
        this.add.bitmapText(centerX, centerY - textSpacer*2, 'gem', `Disintegration averted for ${level}s`, 48).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY - textSpacer, 'gem', `This browser's best: ${highScore}s`, 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY, 'gem', `Press SPACE BAR to Restart`, 36).setOrigin(0.5);

        // add credits text
        this.add.bitmapText(centerX, centerY + textSpacer, 'gem', 'Music from Bensound', 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*1.5, 'gem', 'Sound effects from Pixabay', 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*2, 'gem', 'Game play inspired by Nathan Altice, Travis Faas, and Emanuele Feronato', 24).setOrigin(0.5);
        // set up cursor keys
        keys = this.input.keyboard.createCursorKeys();
    }

    update() {
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(keys.space)) {
            let textureManager = this.textures;
            console.log(textureManager)
            // take snapshot of the entire game viewport (same as title screen)
            this.game.renderer.snapshot((snapshotImage) => {
                console.log('took snapshot in GameOver')
                if(textureManager.exists('titlesnapshot')) {
                    textureManager.remove('titlesnapshot');
                }
                textureManager.addImage('titlesnapshot', snapshotImage);
            });

            // start next scene
            this.scene.start('playScene');
        }
    }
}