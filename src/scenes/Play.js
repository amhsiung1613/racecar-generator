class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
        this.my = { sprite: {}, text: {} };
        this.carSpeed = 0;
        this.maxSpeed = 200;
        this.acceleration = 10;
        this.deceleration = 5;
        this.rotationSpeed = 0.05;

        this.spawnDelay = 2000; // Initial spawn delay for traffic
        // this.my.sprite.enemy = [];
    }

    create() {
        let my = this.my;

        my.sprite.car = this.physics.add.sprite(this.startX, this.startY, "car");
        my.sprite.car.setScale(0.025);
        my.sprite.car.setCollideWorldBounds(true);
        my.sprite.car.setDepth(1);

        this.physics.world.setBounds(0, game.config.height * 0.25, game.config.width, game.config.height);
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

        // Group for traffic
        this.trafficGroup = this.add.group();

        // Initial traffic spawn event
        this.spawnTrafficEvent = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnTraffic,
            callbackScope: this,
            loop: true
        });
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

        //////

        // Move and wrap background image
        // this.backgroundImage.tilePositionY -= this.speed;
        // this.wrapBackground();
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        return true;
    }

    setTrafficVelocity(speed) {
        this.trafficGroup.getChildren().forEach((traffic) => {
            traffic.setVelocityY(speed * 0.5); // Slow down the traffic speed
        });
    }

    wrapBackground() {
        const bgHeight = this.backgroundImage.height;

        if (this.backgroundImage.y <= -bgHeight) {
            this.backgroundImage.y = this.sys.game.config.height;
        }

        if (this.backgroundImage.y >= this.sys.game.config.height) {
            this.backgroundImage.y = -bgHeight;
        }
    }

    spawnTraffic() {
        console.log("test");
        const trafficSprites = ["corner", "long", "med"];
        const spawnPositions = [200, 300, 400, 500];
        const randomSprite = Phaser.Utils.Array.GetRandom(trafficSprites);
        const randomX = Phaser.Utils.Array.GetRandom(spawnPositions);
        const traffic = this.physics.add.sprite(randomX, -150, randomSprite).setScale(0.3);
        // Set a smaller rectangle for the traffic hitbox
        traffic.setVelocityY(this.speed); // Initial velocity to match the road speed
        this.trafficGroup.add(traffic);
    }
}
