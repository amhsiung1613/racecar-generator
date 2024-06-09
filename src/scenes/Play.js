class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
        this.my = { sprite: {}, text: {} };
        this.carSpeed = 0;
        this.maxSpeed = 200;
        this.acceleration = 10;
        this.deceleration = 5;
        this.rotationSpeed = 0.05;

        this.my.trackArray = [];
        this.trackPath = [];
        this.directions = [
            { x: 1, y: 0, angle: 0 },    // Right
            { x: -1, y: 0, angle: 180 }, // Left
            { x: 0, y: 1, angle: 90 },   // Down
            { x: 0, y: -1, angle: -90 }  // Up
        ];
        this.placedPositions = new Set();
        this.startX = 0;
        this.startY = 0;
        this.maxAttempts = 10;
    }

    create() {
        let my = this.my;

        my.sprite.car = this.physics.add.sprite(this.startX, this.startY, "car");
        my.sprite.car.setScale(0.025);
        my.sprite.car.setCollideWorldBounds(true);
        my.sprite.car.setDepth(1);

        this.physics.world.setBounds(0, 0, game.config.width, game.config.height);
        this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
        this.cameras.main.startFollow(my.sprite.car);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");

        this.engineSound = this.sound.add('engine' , {loop:true});
        this.engineSound.play();

        // Display background image
        this.backgroundImage = this.add.tileSprite(0, 0, 700, 700, "road").setOrigin(0, 0);
    }

    update() {
        let car = this.my.sprite.car;

        let pitch = 1 +(this.carSpeed/ this.maxSpeed);
        this.engineSound.setRate(pitch);

        this.physics.velocityFromRotation(
            Phaser.Math.DegToRad(car.angle),
            this.carSpeed,
            car.body.velocity
        );

        let isOnTrack = true;

        for (let track of this.my.trackArray) {
            if (this.collides(track, car)) {
                isOnTrack = true;
                break;
            }
        }

        if (isOnTrack) {
            if (this.left.isDown) {
                car.angle -= Phaser.Math.RadToDeg(this.rotationSpeed);
            } else if (this.right.isDown) {
                car.angle += Phaser.Math.RadToDeg(this.rotationSpeed);
            }

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
        } else {
            this.carSpeed = 10;
            console.log("car off track");
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        return true;
    }
}
