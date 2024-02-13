class Barrier extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + slimeWidth, Phaser.Math.Between(slimeHeight/2, game.config.height - slimeHeight/2), 'platform'); 
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this);    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this);    // add to physics system
        this.setVelocityX(velocity);            // make it go!
        this.setImmovable();                    
        //this.tint = Math.random() * 0xFFFFFF;   // randomize tint
        this.newBarrier = true;                 // custom property to control barrier spawning
    }

    update() {
        // add new barrier when existing barrier hits center X
        if(this.newBarrier && this.x < centerX) {
            // (recursively) call parent scene method from this context
            this.parentScene.addBarrier(this.parent, this.velocity);
            this.newBarrier = false;
        }

        // destroy paddle if it reaches the left edge of the screen
        if(this.x < -this.width) {
            this.destroy();
        }
    }
}


// class Platforms extends Phaser.Scene{
//     constructor(){
//         super("PlayGame");
//     }
//     preload(){
//         this.load.image("platform", "platform.png");
//         this.load.image("player", "player.png");
//     }
//     create(){

//         // group with all active platforms.
//         this.platformGroup = this.add.group({

//             // once a platform is removed, it's added to the pool
//             removeCallback: function(platform){
//                 platform.scene.platformPool.add(platform)
//             }
//         });

//         // pool
//         this.platformPool = this.add.group({

//             // once a platform is removed from the pool, it's added to the active platforms group
//             removeCallback: function(platform){
//                 platform.scene.platformGroup.add(platform)
//             }
//         });

//         // number of consecutive jumps made by the player
//         this.playerJumps = 0;

//         // adding a platform to the game, the arguments are platform width and x position
//         this.addPlatform(game.config.width, game.config.width / 2);

//         // adding the player;
//         this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height / 2, "player");
//         this.player.setGravityY(gameOptions.playerGravity);

//         // setting collisions between the player and the platform group
//         this.physics.add.collider(this.player, this.platformGroup);

//         // checking for input
//         this.input.on("spacedown", this.jump, this);
//     }

//     // the core of the script: platform are added from the pool or created on the fly
//     addPlatform(platformWidth, posX){
//         let platform;
//         if(this.platformPool.getLength()){
//             platform = this.platformPool.getFirst();
//             platform.x = posX;
//             platform.active = true;
//             platform.visible = true;
//             this.platformPool.remove(platform);
//         }
//         else{
//             platform = this.physics.add.sprite(posX, game.config.height * 0.8, "platform");
//             platform.setImmovable(true);
//             platform.setVelocityX(gameOptions.platformStartSpeed * -1);
//             this.platformGroup.add(platform);
//         }
//         platform.displayWidth = platformWidth;
//         this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
//     }
// }
