class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
        this.my = { sprite: {}, text: {} };
        this.carSpeed = 0;
        this.maxSpeed = 200;
        this.acceleration = 10;
        this.deceleration = 5;
        this.rotationSpeed = 0.05;
        this.driftSpeed = 50; // Speed for sideways drift movement

        this.spawnDelay = 2000; // Initial spawn delay for traffic
        this.trafficSpeed = 100; // Initial speed for traffic

        this.startX = game.config.width / 2; // Set a default start position
        this.startY = game.config.height - 100;

        
    }

    init() {
        this.score = 0; // Initialize score
        this.startX = game.config.width / 2; // Set a default start position
        this.startY = game.config.height - 100;
    }

    create() {
        let my = this.my;

        my.sprite.car = this.physics.add.sprite(this.startX, this.startY, "car");
        my.sprite.car.setScale(0.025);
        my.sprite.car.setCollideWorldBounds(true);
        my.sprite.car.setDepth(1);
        my.sprite.car.angle = -90; // Set initial angle to -90 degrees to face upwards

        this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
        this.cameras.main.startFollow(my.sprite.car);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");

        this.engineSound = this.sound.add('engine', { loop: true });
        this.engineSound.play();

        // Display background images
        this.backgroundImage1 = this.add.tileSprite(0, 0, 700, 700, "road").setOrigin(0, 0);
        this.backgroundImage2 = this.add.tileSprite(0, -700, 700, 700, "road2").setOrigin(0, 0);

        // Group for traffic
        this.trafficGroup = this.physics.add.group();

        // Initial traffic spawn event
        this.spawnTrafficEvent = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnTraffic,
            callbackScope: this,
            loop: true
        });

        // Enable collision detection between the car and the traffic group
        this.physics.add.collider(my.sprite.car, this.trafficGroup, this.handleCollision, null, this);

        // Create the score text
        this.scoreText = this.add.text(game.config.width - 150, 10, 'Score: 0', { fontSize: '20px', fill: '#FFF' });
        
        // Start the timer to track the score
        this.timer = this.time.addEvent({
            delay: 1000, // Update every second
            callback: this.updateScore,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        let car = this.my.sprite.car;
    
        let pitch = 1 + (this.carSpeed / this.maxSpeed);
        this.engineSound.setRate(pitch);
    
        this.physics.velocityFromRotation(
            Phaser.Math.DegToRad(car.angle),
            this.carSpeed,
            car.body.velocity
        );
    
        let isOnTrack = true;
    
        if (isOnTrack) {
            if (this.left.isDown) {
                if (car.angle > -170) { // Limit the left rotation to -180 degrees (90 degrees from initial -90)
                    car.angle -= Phaser.Math.RadToDeg(this.rotationSpeed);
                    car.x -= this.driftSpeed * this.game.loop.delta / 1000; // Add sideways drift to the left
                }
            } else if (this.right.isDown) {
                if (car.angle < -10) { // Limit the right rotation to 0 degrees (90 degrees from initial -90)
                    car.angle += Phaser.Math.RadToDeg(this.rotationSpeed);
                    car.x += this.driftSpeed * this.game.loop.delta / 1000; // Add sideways drift to the right
                }
            } else {
                // Slowly straighten the car if no left/right input
                if (car.angle < -90) {
                    car.angle += Phaser.Math.RadToDeg(this.rotationSpeed / 2);
                } else if (car.angle > -90) {
                    car.angle -= Phaser.Math.RadToDeg(this.rotationSpeed / 2);
                }
            }
    
            if (this.up.isDown) {
                this.carSpeed += this.acceleration;
                if (this.carSpeed > this.maxSpeed) {
                    this.carSpeed = this.maxSpeed;
                }
            } else if (this.down.isDown) {
                this.carSpeed -= this.acceleration;
                if (this.carSpeed < -this.maxSpeed / 2) { // Allowing half of maxSpeed for reverse speed
                    this.carSpeed = -this.maxSpeed / 2;
                }
            } else {
                if (this.carSpeed > 0) {
                    this.carSpeed -= this.deceleration;
                } else if (this.carSpeed < 0) {
                    this.carSpeed += this.deceleration;
                }
                if (Math.abs(this.carSpeed) < this.deceleration) {
                    this.carSpeed = 0;
                }
            }
        }
    
        // Adjust car hitbox to fit the car's current angle
        this.updateCarHitbox(car);
    
        // Move and wrap background images
        this.backgroundImage1.tilePositionY += 2;
        this.backgroundImage2.tilePositionY += 2;
        this.wrapBackgrounds();
        
        // Update traffic speed
        this.setTrafficVelocity(this.trafficSpeed);
    
        // Remove obstacles that are out of the play/screen zone
        this.trafficGroup.getChildren().forEach((traffic) => {
            if (traffic.y > game.config.height) {
                traffic.destroy();
            }
        });
    
        // Update world bounds to follow the camera's bounds for the bottom 75% of the screen
        const topBound = game.config.height * 0.25;
        const heightBound = game.config.height * 0.75;
        this.physics.world.setBounds(
            this.backgroundImage1.x,
            this.cameras.main.scrollY + topBound,
            this.backgroundImage1.width,
            heightBound
        );
    }

    updateCarHitbox(car) {
        // Get the current angle in radians
        const angle = Phaser.Math.DegToRad(car.angle);
        // Calculate the width and height based on the angle
        const width = Math.abs(car.width * Math.cos(angle)) + Math.abs(car.height * Math.sin(angle));
        const height = Math.abs(car.width * Math.sin(angle)) + Math.abs(car.height * Math.cos(angle));
        // Set the car hitbox size and offset
        car.body.setSize(width, height, true);
    }

    handleCollision(car, traffic) {
        console.log("crash");
        // Handle the collision logic here (e.g., end game, reduce speed, etc.)
        car.setTint(0xff0000); // Example: change the car color to red on collision
        this.carSpeed = 0; // Stop the car
        this.engineSound.stop(); // Stop the engine sound
        this.scene.restart();

        // Stop the timer and end the game
        this.timer.paused = true;
    }

    setTrafficVelocity(speed) {
        this.trafficGroup.getChildren().forEach((traffic) => {
            traffic.setVelocityY(speed); // Adjust traffic speed to the defined traffic speed
        });
    }

    wrapBackgrounds() {
        const bgHeight = this.backgroundImage1.height;

        if (this.backgroundImage1.tilePositionY >= bgHeight) {
            this.backgroundImage1.tilePositionY = 0;
            this.backgroundImage2.tilePositionY = -bgHeight;
        } else if (this.backgroundImage2.tilePositionY >= bgHeight) {
            this.backgroundImage2.tilePositionY = 0;
            this.backgroundImage1.tilePositionY = -bgHeight;
        }
    }

    spawnTraffic() {
        const trafficSprites = ["deer", "banana"];
        const spawnPositions = [200, 300, 400, 500];
        const randomSprite = Phaser.Utils.Array.GetRandom(trafficSprites);
        const randomX = Phaser.Utils.Array.GetRandom(spawnPositions);
        const traffic = this.physics.add.sprite(randomX, -150, randomSprite).setScale(0.2);
        traffic.setVelocityY(this.trafficSpeed); // Set initial velocity for the traffic
        this.trafficGroup.add(traffic);
    }

    updateScore() {
        this.score += 1; // Increment the score by 1 every second
        this.scoreText.setText('Score: ' + this.score); // Update the score text
    }
}
