
// Slime prefab
class Slime extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Hero to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        this.body.setSize(this.width, this.height)
        this.body.setCollideWorldBounds(true)

        // set custom Hero properties
        this.slimeVelocity = 0    // in pixels
        this.setGravity(150)

        // initialize state machine managing hero (initial state, possible states, state args[])
        scene.slimeFSM = new StateMachine('run', {
            run: new RunState(),
            jump: new JumpState(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
} 

class RunState extends State {
    enter(scene, slime) {
        //slime.setVelocity(100)
        if (slime.destroyed) {
            //this.stateMachine.transition('run')
            return
        }
        slime.anims.play('run')
    }

    execute(scene, slime) {
        const { space } = scene.keys

        if (Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('jump')
            return
        }
    }
}

class JumpState extends State {
    enter(scene, slime) {
        
        //check that slime is alive
        if (slime.destroyed) {
            this.stateMachine.transition('run')
            return
        }

        scene.sound.play('jump_sound', {volume: 1})
        slime.setVelocity(0, -200)
        //slime.once('animationcomplete', () => {
        this.stateMachine.transition('run')
        //})
    }
}

