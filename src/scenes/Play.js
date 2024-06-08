// class Play extends Phaser.Scene {
//     constructor() {
//         super('playScene');
//         this.my = { sprite: {}, text: {} };
//         this.carSpeed = 0;
//         this.maxSpeed = 200; // Maximum speed of the car
//         this.acceleration = 10; // Acceleration rate
//         this.deceleration = 5; // Deceleration rate
//         this.rotationSpeed = 0.05; // Rotation speed in radians

//         this.my.trackArray = [];
//     }

//     create() {
//         let my = this.my;

//         // set up player car (physics sprite) and set properties
//         my.sprite.car = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "car");
//         my.sprite.car.setScale(0.02);
//         my.sprite.car.setCollideWorldBounds(true);
//         my.sprite.car.setDepth(1);


//         // my.sprite.corner = this.physics.add.sprite(game.config.width / 4, game.config.height / 4, "corner");
//         // my.sprite.corner.setScale(0.5)
//         // my.sprite.long = this.physics.add.sprite(game.config.width / 8, game.config.height / 8, "long");
//         // my.sprite.long.setScale(0.5)

//         // Create key objects
//         this.cursors = this.input.keyboard.createCursorKeys();
//         this.left = this.input.keyboard.addKey("A");
//         this.right = this.input.keyboard.addKey("D");
//         this.up = this.input.keyboard.addKey("W");
//         this.down = this.input.keyboard.addKey("S");

//         this.addTrack();
//     }

//     update() {
//         let car = this.my.sprite.car;

        

//         // Update car velocity
//         this.physics.velocityFromRotation(
//             Phaser.Math.DegToRad(car.angle),
//             this.carSpeed,
//             car.body.velocity
//         );

//         let isOnTrack = false;

//         for (let track of this.my.trackArray) {
//             if (this.collides(track, car)) {
//                 isOnTrack = true;
//                 break;
//             }
//         }

//         //checks if the car is on or off the track
//         if (isOnTrack) {
//             // Handle rotation
//             if (this.left.isDown) {
//                 car.angle -= Phaser.Math.RadToDeg(this.rotationSpeed);
//             } else if (this.right.isDown) {
//                 car.angle += Phaser.Math.RadToDeg(this.rotationSpeed);
//             }

//             // Handle acceleration and deceleration
//             if (this.up.isDown) {
//                 this.carSpeed += this.acceleration;
//                 if (this.carSpeed > this.maxSpeed) {
//                     this.carSpeed = this.maxSpeed;
//                 }
//             } else {
//                 if (this.carSpeed > 0) {
//                     this.carSpeed -= this.deceleration;
//                 }
//                 if (this.carSpeed < 0) {
//                     this.carSpeed = 0;
//                 }
//             }
//         } else {
//             this.carSpeed = 10;
//             console.log("car off track");
//         }
//     }


//     // A center-radius AABB collision check
//     collides(a, b) {
//         if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
//         if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
//         return true;
//     }


//     addTrack() {
//         let my = this.my;
//         let trackLength = 20; // number of track pieces
//         let startX = game.config.width / 2;
//         let startY = game.config.height / 2;

//         let directions = [
//             { x: 1, y: 0, angle: 0 },    // Right
//             { x: -1, y: 0, angle: 180 }, // Left
//             { x: 0, y: 1, angle: 90 },   // Down
//             { x: 0, y: -1, angle: -90 }  // Up
//         ];

//         let lastX = startX;
//         let lastY = startY;
//         let lastAngle = 0;

//         let placedPositions = new Set();
//         placedPositions.add(`${lastX},${lastY}`);

//         for (let i = 0; i < trackLength; i++) {
//             let direction;
//             let newX, newY;

//             // Try to find a non-overlapping position
//             for (let attempt = 0; attempt < 10; attempt++) {
//                 direction = Phaser.Math.RND.pick(directions);

//                 newX = lastX + direction.x * 100;
//                 newY = lastY + direction.y * 100;

//                 if (!placedPositions.has(`${newX},${newY}`)) {
//                     break;
//                 }
//             }

//             // Add the position to the set
//             placedPositions.add(`${newX},${newY}`);

//             let trackPiece;
//             if (i % 5 === 0) {
//                 trackPiece = this.physics.add.sprite(newX, newY, "corner");
//             } else {
//                 trackPiece = this.physics.add.sprite(newX, newY, "long");
//             }

//             trackPiece.setAngle(direction.angle);

//             trackPiece.setScale(0.5);
//             trackPiece.setImmovable(true); // Make track pieces immovable
//             my.trackArray.push(trackPiece);

//             lastX = newX;
//             lastY = newY;
//             lastAngle = direction.angle;
//         }
//     }

// }

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
    }

    create() {
        let my = this.my;

        // Set up player car (physics sprite) and set properties
        my.sprite.car = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "car");
        my.sprite.car.setScale(0.025);
        my.sprite.car.setCollideWorldBounds(true);
        my.sprite.car.setDepth(1);

        
        // Make the camera follow the car
        this.cameras.main.startFollow(my.sprite.car);

        // Create key objects
        this.cursors = this.input.keyboard.createCursorKeys();
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");

        this.addTrack();

        //engine sounds
        this.engineSound = this.sound.add('engine');
        this.engineSound = this.sound.add('engine' , {loop:true});
        this.engineSound.play();
    }

    update() {
        let car = this.my.sprite.car;

        // this.physics.world.setBounds(car.x, car.y, 1000, 1000);

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

        //engine sound changing
        let pitch = 1 +(this.carSpeed/ this.maxSpeed);
        this.engineSound.setRate(pitch);
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        return true;
    }

    // Create new barriers and add them to existing barrier group
    addTrack() {
        let my = this.my;
        let trackLength = 20; // Number of track pieces
        let startX = game.config.width / 2;
        let startY = game.config.height / 2;

        // Initial direction is upward (north)
        let currentDirection = { x: 0, y: -1, angle: -90 };
        this.trackPath.push({ x: startX, y: startY, direction: currentDirection });

        let directions = [
            { x: 1, y: 0, angle: 0 },    // Right
            { x: -1, y: 0, angle: 180 }, // Left
            { x: 0, y: 1, angle: 90 },   // Down
            { x: 0, y: -1, angle: -90 }  // Up
        ];

        let lastX = startX;
        let lastY = startY;

        for (let i = 0; i < trackLength; i++) {
            let newDirection;
            let newX, newY;
            let isValidPosition = false;

            while (!isValidPosition) {
                newDirection = Phaser.Math.RND.pick(directions);
                newX = lastX + newDirection.x * 100;
                newY = lastY + newDirection.y * 100;

                isValidPosition = this.isValidTrackPosition(newX, newY);

                if (isValidPosition) {
                    this.trackPath.push({ x: newX, y: newY, direction: newDirection });
                }
            }

            let trackPiece;
            if (i % 5 === 0) {
                trackPiece = this.physics.add.sprite(newX, newY, "corner");
                trackPiece.setAngle(newDirection.angle);
            } else {
                trackPiece = this.physics.add.sprite(newX, newY, "long");
                trackPiece.setAngle(newDirection.angle);
            }

            trackPiece.setScale(0.5);
            trackPiece.setImmovable(true); // Make track pieces immovable
            my.trackArray.push(trackPiece);

            lastX = newX;
            lastY = newY;
        }
    }

    // Check if a track position is valid (not overlapping with existing tracks)
    isValidTrackPosition(x, y) {
        for (let position of this.trackPath) {
            if (position.x === x && position.y === y) {
                return false;
            }
        }
        return true;
    }
}
