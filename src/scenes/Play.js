class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
        this.my = { sprite: {}, text: {} };
        this.carSpeed = 0;
        this.maxSpeed = 200; // Maximum speed of the car
        this.acceleration = 10; // Acceleration rate
        this.deceleration = 5; // Deceleration rate
        this.rotationSpeed = 0.05; // Rotation speed in radians
    }

    create() {
        let my = this.my;

        // set up player car (physics sprite) and set properties
        my.sprite.car = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "car");
        my.sprite.car.setScale(0.025);
        my.sprite.car.setCollideWorldBounds(true);
        my.sprite.corner = this.add.sprite(game.config.width / 4, game.config.height / 4, "corner");
        my.sprite.corner.setScale(0.5)

        // Create key objects
        this.cursors = this.input.keyboard.createCursorKeys();
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
    }

    update() {
        let car = this.my.sprite.car;

        // Handle rotation
        if (this.left.isDown) {
            car.angle -= Phaser.Math.RadToDeg(this.rotationSpeed);
        } else if (this.right.isDown) {
            car.angle += Phaser.Math.RadToDeg(this.rotationSpeed);
        }

        // Handle acceleration and deceleration
        if (this.up.isDown) {
            this.carSpeed += this.acceleration;
            if (this.carSpeed > this.maxSpeed) {
                this.carSpeed = this.maxSpeed;
            }
        } else {
            if (this.carSpeed > 0) {
                this.carSpeed -= this.deceleration;
            }
            if (this.carSpeed < 0) {
                this.carSpeed = 0;
            }
        }

        // Update car velocity
        this.physics.velocityFromRotation(
            Phaser.Math.DegToRad(car.angle),
            this.carSpeed,
            car.body.velocity
        );
    }


    // create new barriers and add them to existing barrier group
    addTrack() {
        let track = new Track(this, this.trackSpeed - speedVariance);
        this.trackGroup.add(track);
        
    }

    slimeCollision() {
        slime.destroyed = true;                    // turn off collision checking
        this.difficultyTimer.destroy();             // shut down timer
        this.sound.play('death', { volume: 0.25 }); // play death sound
        this.cameras.main.shake(2500, 0.0075);      // camera death shake
        
        // add tween to fade out audio
        this.tweens.add({
            targets: this.bgm,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
        });

        // create particle explosion
        let deathParticleManager = this.add.particles('particle');
        let deathEmitter = deathParticleManager.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.75, end: 0 },
            speed: { min: -150, max: 150 },
            lifespan: 4000,
            blendMode: 'ADD'
        });
        // store current paddle bounds so we can create a paddle-shaped death emitter
        let sBounds = slime.getBounds();
        deathEmitter.setEmitZone({
            source: new Phaser.Geom.Rectangle(sBounds.x, sBounds.y, sBounds.width, sBounds.height),
            type: 'edge',
            quantity: 1000
        });
        // make it boom 💥
        deathEmitter.explode(1000);
        
        // create two gravity wells: one offset from paddle and one at center screen
        deathParticleManager.createGravityWell({
            x: sBounds.centerX + 200,
            y: sBounds.centerY,
            power: 0.5,
            epsilon: 100,
            gravity: 100
        });
        deathParticleManager.createGravityWell({
            x: centerX,
            y: centerY,
            power: 2,
            epsilon: 100,
            gravity: 150
        });
       
        // kill paddle
        slime.destroy();    

        // switch states after timer expires
        this.time.delayedCall(4000, () => { this.scene.start('gameOverScene'); });
    }
}