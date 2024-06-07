class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
        this.my = { sprite: {}, text: {} };
        this.carSpeed = 0;
        this.maxSpeed = 200; // Maximum speed of the car
        this.acceleration = 10; // Acceleration rate
        this.deceleration = 5; // Deceleration rate
        this.rotationSpeed = 0.05; // Rotation speed in radians

        this.my.trackArray = [];
    }

    create() {
        let my = this.my;

        // set up player car (physics sprite) and set properties
        my.sprite.car = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "car");
        my.sprite.car.setScale(0.025);
        my.sprite.car.setCollideWorldBounds(true);

        my.sprite.corner = this.physics.add.sprite(game.config.width / 4, game.config.height / 4, "corner");
        my.sprite.corner.setScale(0.5)
        my.sprite.long = this.physics.add.sprite(game.config.width / 8, game.config.height / 8, "long");
        my.sprite.long.setScale(0.5)

        // Create key objects
        this.cursors = this.input.keyboard.createCursorKeys();
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");

        this.addTrack();
    }

    update() {
        let car = this.my.sprite.car;

        

        // Update car velocity
        this.physics.velocityFromRotation(
            Phaser.Math.DegToRad(car.angle),
            this.carSpeed,
            car.body.velocity
        );

        let isOnTrack = false;

        for (let track of this.my.trackArray) {
            if (this.collides(track, car)) {
                isOnTrack = true;
                break;
            }
        }

        //checks if the car is on or off the track
        if (isOnTrack) {
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
        } else {
            this.carSpeed = 10;
            console.log("car off track");
        }
    }


    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    // create new barriers and add them to existing barrier group
    addTrack() {
        let my = this.my;
        let trackLength = 20; // number of track pieces
        let startX = game.config.width / 2;
        let startY = game.config.height / 2;

        let directions = [
            { x: 1, y: 0, angle: 0 },    // Right
            { x: -1, y: 0, angle: 180 }, // Left
            { x: 0, y: 1, angle: 90 },   // Down
            { x: 0, y: -1, angle: -90 }  // Up
        ];

        let lastX = startX;
        let lastY = startY;
        let lastAngle = 0;

        for (let i = 0; i < trackLength; i++) {
            let direction = Phaser.Math.RND.pick(directions);

            let newX = lastX + direction.x * 100;
            let newY = lastY + direction.y * 100;

            let trackPiece;
            if (i % 5 === 0) {
                trackPiece = this.physics.add.sprite(newX, newY, "corner");
                trackPiece.setAngle(direction.angle);
            } else {
                trackPiece = this.physics.add.sprite(newX, newY, "long");
                trackPiece.setAngle(direction.angle);
            }

            trackPiece.setScale(0.5);
            trackPiece.setImmovable(true); // Make track pieces immovable
            my.trackArray.push(trackPiece);

            lastX = newX;
            lastY = newY;
            lastAngle = direction.angle;
        }
    }
}