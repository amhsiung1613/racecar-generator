class Track extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        // call Phaser Physics Sprite constructor
        // super(scene, game.config.width + slimeWidth, Phaser.Math.Between(slimeHeight/2, game.config.height - slimeHeight/2), 'platform'); 
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this);    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this);    // add to physics system
        // this.setVelocityX(velocity);            // make it go!
        this.setImmovable();                    
        this.newBarrier = true;                 // custom property to control barrier spawning
    }

    update() {
        // add new trac when existing track leaves the top edge of the map
        if(this.newBarrier && this.x < game.config.height) {
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


