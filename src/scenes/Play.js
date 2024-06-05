class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        //parallax scrolling
        this.nightSky = this.add.tileSprite(0, 0, 960, 640, 'nightSky').setOrigin(0, 0)
        this.background = this.add.tileSprite(0, 0, 960, 640, 'background').setOrigin(0, 0)
        this.midground = this.add.tileSprite(0, 0, 960, 640, 'midground').setOrigin(0, 0)
        this.foreground = this.add.tileSprite(0, 0, 960, 640, 'foreground').setOrigin(0, 0)
        this.ground = this.add.tileSprite(0, 0, 960, 640, 'ground').setOrigin(0, 0)


        // reset parameters
        // this.barrierSpeed = -450;
        // this.barrierSpeedMax = -1000;
        // level = 0;
        // this.extremeMODE = false;
        // this.shadowLock = false;

        // set up audio, play bgm
        // this.bgm = this.sound.add('beats', { 
        //     mute: false,
        //     volume: 0.5,
        //     rate: 1,
        //     loop: true 
        // });
        // this.bgm.play();

        // add snapshot image from prior Scene
        if (this.textures.exists('titlesnapshot')) {
            let titleSnap = this.add.image(centerX, centerY, 'titlesnapshot').setOrigin(0.5);
            this.tweens.add({
                targets: titleSnap,
                duration: 4500,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0 },
                repeat: 0
            });
        } else {
            console.log('texture error');
        }

        // 🎉 let's get the PARTYcles started 🎉
        // create line on right side of screen for particles source
        let line = new Phaser.Geom.Line(w, 0, w, h);  
        // create particle manager  
        this.particleManager = this.add.particles('particle');
        // add emitter and setup properties
        this.lineEmitter = this.particleManager.createEmitter({
            gravityX: -200,
            lifespan: 7000,
            alpha: { start: 0.3, end: 0.0 },
            //tint: [ 0xffff00, 0xff0000, 0x00ff00, 0x00ffff, 0x0000ff ],
            emitZone: { type: 'random', source: line, quantity: 500 },
            blendMode: 'MULTIPLY'
        });

        // set up player paddle (physics sprite) and set properties
        car = new Car(this, 100, 608, 'slime', 0, 'down')
        car.setCollideWorldBounds(true);
        car.setImmovable();
        car.setMaxVelocity(0, 600);
        car.setDepth(1);             // ensures that paddle z-depth remains above shadow paddles
        // car.destroyed = false;       // custom property to track paddle life
        // car.setBlendMode('SCREEN');  // set a WebGL blend mode

        // set up barrier group
        this.trackGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        
        // wait a few seconds before spawning barriers
        // this.time.delayedCall(2500, () => { 
            
        //     this.addBarrier(); 
        // });

    

        // set up difficulty timer (triggers callback every second)
        // this.difficultyTimer = this.time.addEvent({
        //     delay: 1000,
        //     callback: this.levelBump,
        //     callbackScope: this,
        //     loop: true
        // });

        // set up cursor keys
        this.keys = this.input.keyboard.createCursorKeys();
        
    }

    // create new barriers and add them to existing barrier group
    addTrack() {
        // this.sound.play('platform', {volume: 1.5})
        // let speedVariance =  Phaser.Math.Between(0, 50);
        let track = new Track(this, this.trackSpeed - speedVariance);
        this.trackGroup.add(track);
        
    }

    update() {
        // this.slimeFSM.step()
        // // make sure paddle is still alive
        // if(!slime.destroyed) {
        //     // check for collisions
        //     this.physics.world.collide(slime, this.barrierGroup, this.slimeCollision, null, this);
        //     //}
            
        // }

        // // spawn rainbow trail if in EXTREME mode
        // if(this.extremeMODE && !this.shadowLock && !slime.destroyed) {
        //     this.spawnShadowSlime();
        //     this.shadowLock = true;
        //     // lock shadow paddle spawning to a given time interval
        //     this.time.delayedCall(15, () => { this.shadowLock = false; })
        // }

        this.nightSky.tilePositionX -= 1
        this.background.tilePositionX -= 2
        this.midground.tilePositionX -= 3
        this.foreground.tilePositionX -= 4

        
    }

    // levelBump() {
    //     // increment level (ie, score)
    //     level++;

    //     // bump speed every 5 levels (until max is hit)
    //     if(level % 5 == 0) {
    //         //console.log(`level: ${level}, speed: ${this.barrierSpeed}`);
    //         this.sound.play('clang', { volume: 0.5 });         // play clang to signal speed up
    //         if(this.barrierSpeed >= this.barrierSpeedMax) {     // increase barrier speed
    //             this.barrierSpeed -= 25;
    //             this.bgm.rate += 0.01;                          // increase bgm playback rate (ドキドキ)
    //         }
            
    //         // make flying score text (using three stacked)
    //         let lvltxt01 = this.add.bitmapText(w, centerY, 'gem', `<${level}>`, 96).setOrigin(0, 0.5);
    //         let lvltxt02 = this.add.bitmapText(w, centerY, 'gem', `<${level}>`, 96).setOrigin(0, 0.5);
    //         let lvltxt03 = this.add.bitmapText(w, centerY, 'gem', `<${level}>`, 96).setOrigin(0, 0.5);
    //         lvltxt01.setBlendMode('ADD').setTint(0xff00ff);
    //         lvltxt02.setBlendMode('SCREEN').setTint(0x0000ff);
    //         lvltxt03.setBlendMode('ADD').setTint(0xffff00);
    //         this.tweens.add({
    //             targets: [lvltxt01, lvltxt02, lvltxt03],
    //             duration: 2500,
    //             x: { from: w, to: 0 },
    //             alpha: { from: 0.9, to: 0 },
    //             onComplete: function() {
    //                 lvltxt01.destroy();
    //                 lvltxt02.destroy();
    //                 lvltxt03.destroy();
    //             }
    //         });
    //         this.tweens.add({
    //             targets: lvltxt02,
    //             duration: 2500,
    //             y: '-=20'       // slowly nudge y-coordinate up
    //         });
    //         this.tweens.add({
    //             targets: lvltxt03,
    //             duration: 2500,
    //             y: '+=20'       // slowly nudge y-coordinate down
    //         });
 

    //         // cam shake: .shake( [duration] [, intensity] )
    //         this.cameras.main.shake(100, 0.01);
    //     }

    //     // set HARD mode
    //     if(level == 45) {
    //         slime.scaleY = 0.75;       // 3/4 paddle size
    //     }
    //     // set EXTREME mode
    //     if(level == 75) {
    //         slime.scaleY = 0.5;        // 1/2 paddle size
    //         this.extremeMODE = true;    // 🌈
    //     }
    // }

    // random HTML hex color generator from:
    // https://stackoverflow.com/questions/1484506/random-color-generator
    // getRandomColor() {
    //     let letters = '0123456789ABCDEF';
    //     let color = '#';
    //     for (let i = 0; i < 6; i++) {
    //         color += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return color;
    // }

    // spawnShadowSlime() {
    //     // add a "shadow paddle" at main paddle position
    //     let shadowSlime = this.add.image(slime.x, slime.y, 'slime').setOrigin(0.5);
    //     shadowSlime.scaleY = slime.scaleY;            // scale to parent paddle
    //     shadowSlime.tint = Math.random() * 0xFFFFFF;   // tint w/ rainbow colors
    //     shadowSlime.alpha = 0.5;                       // make semi-transparent
    //     // tween shadow paddle alpha to 0
    //     this.tweens.add({ 
    //         targets: shadowSlime, 
    //         alpha: { from: 0.5, to: 0 }, 
    //         duration: 750,
    //         ease: 'Linear',
    //         repeat: 0 
    //     });
    //     // set a kill timer for trail effect
    //     this.time.delayedCall(750, () => { shadowSlime.destroy(); } );
    // }

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