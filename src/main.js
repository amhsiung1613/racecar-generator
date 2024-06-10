// Amber Hsiung
// Slime Run
// An endless runner game
// Barrier prefab adapted from Travis Faas, An Introduction to HTML5 Game Development with Phaser.js (2017)
// inpsired by Nathan Altice's Paddle Parkour
// inspired by Emanuele Feronato's endless runner tutorial
// creative tilt
//      created the art for the background as well as implemented the parallax scrolling and implementing sound
//      use local storage to keep track of browser's high score as well as figuring out jump mechanics

// keep me honest
'use strict';


// define and configure main Phaser game object
let config = {
    parent: 'myGame',
    type: Phaser.AUTO,
    height: 700,
    width: 900,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Load, Title, Play, GameOver, Credits ]
}

// uncomment the following line if you need to purge local storage data
//localStorage.clear();

// define game
let game = new Phaser.Game(config);

// define globals
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let w = game.config.width;
let h = game.config.height;
const textSpacer = 64;
let car = null;
// const slimeHeight = 16;
// const slimeWidth = 16;
let level;
let highScore;
let newHighScore = false;
let keys;