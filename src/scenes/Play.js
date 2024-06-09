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
        this.addTrack();

        let my = this.my;

        my.sprite.car = this.physics.add.sprite(this.startX, this.startY, "car");
        my.sprite.car.setScale(0.025);
        my.sprite.car.setCollideWorldBounds(true);
        my.sprite.car.setDepth(1);

        this.physics.world.setBounds(0, 0, 4000, 4000);
        this.cameras.main.setBounds(0, 0, 4000, 4000);
        this.cameras.main.startFollow(my.sprite.car);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");

        this.engineSound = this.sound.add('engine' , {loop:true});
        this.engineSound.play();
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

        let isOnTrack = false;

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

    addTrack() {
        let attempts = 0;
        while (attempts < this.maxAttempts) {
            if (this.generateTrack()) {
                return;
            }
            attempts++;
        }
        console.error("Failed to generate a valid track after maximum attempts");
    }

    generateTrack() {
        this.my.trackArray.forEach(track => track.destroy());
        this.my.trackArray = [];
        this.trackPath = [];
        this.placedPositions = new Set();

        let my = this.my;
        let trackLength = 20;
        this.startX = game.config.width / 2;
        this.startY = game.config.height / 2;

        let currentDirection = { x: 0, y: -1, angle: -90 };
        this.trackPath.push({ x: this.startX, y: this.startY, direction: currentDirection });
        this.placedPositions.add(`${this.startX},${this.startY}`);

        let lastX = this.startX;
        let lastY = this.startY;

        for (let i = 0; i < trackLength; i++) {
            let newDirection;
            let newX, newY;
            let isValidPosition = false;
            let attempts = 0;

            while (!isValidPosition && attempts < this.maxAttempts) {
                newDirection = this.chooseNextDirection(currentDirection);
                if (i % 5 === 0) {
                    // Corner piece
                    newX = lastX + newDirection.x * 142;
                    newY = lastY + newDirection.y * 134;
                } else {
                    // Long piece
                    newX = lastX + newDirection.x * 101;
                    newY = lastY + newDirection.y * 363;
                }

                isValidPosition = this.isValidTrackPosition(newX, newY);
                attempts++;

                if (isValidPosition) {
                    this.trackPath.push({ x: newX, y: newY, direction: newDirection });
                    this.placedPositions.add(`${newX},${newY}`);
                }
            }

            if (!isValidPosition) {
                return false;
            }

            let trackPiece;
            if (i % 5 === 0) {
                trackPiece = this.physics.add.sprite(newX, newY, "corner");
                trackPiece.setAngle(newDirection.angle);
                this.setTrackPieceHitbox(trackPiece, newDirection.angle, 'corner');
            } else {
                trackPiece = this.physics.add.sprite(newX, newY, "long");
                trackPiece.setAngle(newDirection.angle);
                this.setTrackPieceHitbox(trackPiece, newDirection.angle, 'long');
            }

            trackPiece.setScale(0.5);
            trackPiece.setImmovable(true);
            my.trackArray.push(trackPiece);

            lastX = newX;
            lastY = newY;
            currentDirection = newDirection;
        }

        return true;
    }

    chooseNextDirection(currentDirection) {
        let possibleDirections = this.directions.filter(dir => 
            (dir.x === currentDirection.x && dir.y === currentDirection.y) ||
            (dir.angle === (currentDirection.angle + 90) % 360) ||
            (dir.angle === (currentDirection.angle - 90 + 360) % 360)
        );
        return Phaser.Math.RND.pick(possibleDirections);
    }

    setTrackPieceHitbox(trackPiece, angle, type) {
        trackPiece.body.setSize(trackPiece.width, trackPiece.height);

        if (type === 'long') {
            if (angle === 0 || angle === 180) {
                trackPiece.body.setSize(trackPiece.displayWidth, trackPiece.displayHeight);
            } else {
                trackPiece.body.setSize(trackPiece.displayWidth * 3.5, trackPiece.displayHeight / 4.2);
            }
        }
    }

    isValidTrackPosition(x, y) {
        return !this.placedPositions.has(`${x},${y}`);
    }
}
