// Amber Hsiung
// Slime Run
// An endless runner game
// Barrier prefab adapted from Travis Faas, An Introduction to HTML5 Game Development with Phaser.js (2017)
// inspired by Emanuele Feronato's endless runner tutorial

// keep me honest
'use strict';

//global game options
let gameOptions = {
    spawnRange: [100, 350],
    platformSizeRange: [100, 250],
    //playerGravity: 900,
    jumpForce: 400,
    playerStartPosition: 200,
    jumps: 2    
}
// define and configure main Phaser game object
let config = {
    parent: 'myGame',
    type: Phaser.AUTO,
    height: 640,
    width: 960,
    pixelArt: true,
    scale: {
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
    scene: [ Load, Title, Play, GameOver ]
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
// let paddle = null;
// const paddleWidth = 16;
// const paddleHeight = 128;
// const paddleVelocity = 150;
let slime = null;
const slimeHeight = 16;
const slimeWidth = 16;
//const slimeVelocity = 150;
let level;
let highScore;
let newHighScore = false;
let keys;