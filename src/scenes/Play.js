
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
        this.trackPath = []; // Array to store the positions and directions of track pieces
        this.directions = [
            { x: 1, y: 0, angle: 0 },    // Right
            { x: -1, y: 0, angle: 180 }, // Left
            { x: 0, y: 1, angle: 90 },   // Down
            { x: 0, y: -1, angle: -90 }  // Up
        ];
        this.placedPositions = new Set(); // Set to store placed positions
        this.startX = 0;
        this.startY = 0;
        this.maxAttempts = 10; // Maximum attempts to find a valid position for a track piece
    }

    create() {
        // Generate the track first to get the starting position
        this.addTrack();

        let my = this.my;

        // Set up player car (physics sprite) and set properties
        my.sprite.car = this.physics.add.sprite(this.startX, this.startY, "car");
        my.sprite.car.setScale(0.025);
        my.sprite.car.setCollideWorldBounds(true);
        my.sprite.car.setDepth(1);

        // Set the world bounds (e.g., 4000x4000 pixels)
        this.physics.world.setBounds(0, 0, 4000, 4000);
        this.cameras.main.setBounds(0, 0, 4000, 4000);

        // Make the camera follow the car
        this.cameras.main.startFollow(my.sprite.car);

        // Create key objects
        this.cursors = this.input.keyboard.createCursorKeys();
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
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

        // Checks if the car is on or off the track
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
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        return true;
    }

    // Create new barriers and add them to existing barrier group
    addTrack() {
        let attempts = 0;
        while (attempts < this.maxAttempts) {
            if (this.generateTrack()) {
                return; // Successfully generated track
            }
            attempts++;
        }
        console.error("Failed to generate a valid track after maximum attempts");
    }

    generateTrack() {
        this.my.trackArray.forEach(track => track.destroy()); // Clear existing track pieces
        this.my.trackArray = [];
        this.trackPath = [];
        this.placedPositions = new Set();

        let my = this.my;
        let trackLength = 20; // Number of track pieces
        this.startX = game.config.width / 2;
        this.startY = game.config.height / 2;

        // Initial direction is upward (north)
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
                newX = lastX + newDirection.x * 100;
                newY = lastY + newDirection.y * 100;

                isValidPosition = this.isValidTrackPosition(newX, newY);
                attempts++;

                if (isValidPosition) {
                    this.trackPath.push({ x: newX, y: newY, direction: newDirection });
                    this.placedPositions.add(`${newX},${newY}`);
                }
            }

            if (!isValidPosition) {
                return false; // Failed to generate a valid track
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
            trackPiece.setImmovable(true); // Make track pieces immovable
            my.trackArray.push(trackPiece);

            lastX = newX;
            lastY = newY;
            currentDirection = newDirection; // Update current direction
        }

        return true; // Successfully generated track
    }

    // Choose the next direction based on the current direction
    chooseNextDirection(currentDirection) {
        // Simplified to always continue in the current direction or turn left/right
        let possibleDirections = this.directions.filter(dir => 
            (dir.x === currentDirection.x && dir.y === currentDirection.y) ||
            (dir.angle === (currentDirection.angle + 90) % 360) ||
            (dir.angle === (currentDirection.angle - 90 + 360) % 360)
        );
        return Phaser.Math.RND.pick(possibleDirections);
    }

    // Set hitbox size and offset based on the orientation of the track piece

    //car can register as off track even when its still on track hitbox

    setTrackPieceHitbox(trackPiece, angle, type) {
        // Reset the body size to its default
        trackPiece.body.setSize(trackPiece.width, trackPiece.height);

        if (type === 'long') {
            if (angle === 0 || angle === 180) {
                // Horizontal
                trackPiece.body.setSize(trackPiece.displayWidth, trackPiece.displayHeight);
                // trackPiece.body.setOffset(0, trackPiece.displayHeight);
            } else {
                // Vertical
                trackPiece.body.setSize(trackPiece.displayWidth * 3.5, trackPiece.displayHeight/4.2);
                // trackPiece.body.setOffset(trackPiece.displayWidth / 4, 0);
                
            }
        }
    }

    // Check if a track position is valid (not overlapping with existing tracks)
    isValidTrackPosition(x, y) {
        return !this.placedPositions.has(`${x},${y}`);
    }
}
