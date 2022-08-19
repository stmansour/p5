/*jshint esversion: 6 */

const MODE_NOT_PLAYING = 0;
const MODE_NEW_GAME_1_PLAYER = 1;
const MODE_NEW_GAME_2_PLAYERS = 2;
const MODE_HOLD_SCREEN_MSG = 3;
const MODE_NEXT_WAVE = 4;

const GAME_IN_PROGRESS = 0;
const GAME_PLAYER_DEFEATED_WAVE = 1;
const GAME_PLAYER_LOST_WAVE = 2;
const GAME_PLAYER_LOST = 3;
const GAME_PLAYER_WON = 4;  // I don't know about this, not sure how player wins.
const GAME_HOLD_FOR_MESSAGE = 100;

class SpaceInvadersApp {
    constructor() {
        this.a1 = null; // invader a image arms down
        this.a2 = null; // invader a image arms up
        this.b1 = null; // invader a image arms down
        this.b2 = null; // invader a image arms up
        this.c1 = null; // invader a image arms down
        this.c2 = null; // invader a image arms up
        this.d = null;  // mystery ship
        this.bmb3a = null;      // bomb 3
        this.eplode = null;     // explosion graphic
        this.cannon = null;     // the laser cannon image
        this.cannonShot = null; // the laser cannon image
        this.invaders = null;
        this.laserCannon = null;
        this.shots = null;
        this.maxShipWidth = 0;
        this.border = 30;
        this.topBar = 50; // y limit of top area for messages/scores, etc.
        this.gameOver = false;
        this.gameOverTimer = null;
        this.gameStatus = 0; // 0 = in progress, 1 = player won, 2 = player lost
        this.players = []; // array of player objects.
        this.currentPlayer = 0; // during play, this can be 0 or 1
        this.highScore = 0;
        this.credits = 0;
        this.cSize = 14; // size of large characters
        this.font = null;
        this.mode = MODE_NOT_PLAYING; // 0 = not playing, 1 = 1 player, 2 = 2 players, 3 = freeze screen so user can see why they lost
        this.screen = new SIScreen();
        this.msgTmr = null;
        this.bottomLineHeight = 0;
    }

    loadImages() {
        this.a1 = loadImage('assets/a1.png');
        this.a2 = loadImage('assets/a2.png');
        this.b1 = loadImage('assets/b1.png');
        this.b2 = loadImage('assets/b2.png');
        this.c1 = loadImage('assets/c1.png');
        this.c2 = loadImage('assets/c2.png');
        this.c2 = loadImage('assets/c2.png');
        this.d  = loadImage('assets/d.png');
        this.bmb1a = loadImage('assets/bmb1a.png');
        this.bmb1b = loadImage('assets/bmb1b.png');
        this.bmb2a = loadImage('assets/bmb2a.png');
        this.bmb2b = loadImage('assets/bmb2b.png');
        this.bmb2c = loadImage('assets/bmb2c.png');
        this.bmb3a = loadImage('assets/bmb3a.png');
        this.bmb3b = loadImage('assets/bmb3b.png');
        this.bmb3c = loadImage('assets/bmb3c.png');
        this.explode  = loadImage('assets/explode.png');
        this.cannon = loadImage('assets/lasercannon.png');
        this.cannonShot = loadImage('assets/cannonshot.png');

        this.font = loadFont("assets/PixelSplitter-Bold.ttf");
    }

    loadAllPixels() {
        this.a1.loadPixels();
        this.a2.loadPixels();
        this.b1.loadPixels();
        this.b2.loadPixels();
        this.c1.loadPixels();
        this.c2.loadPixels();
        this.d.loadPixels();
        this.bmb1a.loadPixels();
        this.bmb1b.loadPixels();
        this.bmb2a.loadPixels();
        this.bmb2b.loadPixels();
        this.bmb2c.loadPixels();
        this.bmb3a.loadPixels();
        this.bmb3b.loadPixels();
        this.bmb3c.loadPixels();
        this.explode.loadPixels();
        this.cannon.loadPixels();
        this.cannonShot.loadPixels();
        app.bottomLineHeight = height - app.cannon.height - 20;
    }

    setMaxShipWidth() {
        this.maxShipWidth = this.a1.width;
        if (this.b1.width > this.maxShipWidth) {
            this.maxShipWidth = this.b1.width;
        }
        if (this.c1.width > this.maxShipWidth) {
            this.maxShipWidth = this.c1.width;
        }
    }

    nextWave() {
        this.invaders = new Invaders();
        this.invaders.init();
        this.invaders.speed = 5; // each horizontal move is this many pixels
        this.laserCannon = new LaserCannon();
        this.laserCannon.init();
        this.shots = new Shots();
        this.gameStatus = GAME_IN_PROGRESS;
        this.screen.insertCoinsShow = false;
    }

    newGame() {
        // TODO: check for second player
        this.nextWave();
    }

    // call immediately after win detected for tasks that should be done
    // only once upon winning a game.
    winTasks() {
        this.players[this.currentPlayer].waveTop += 20; // next wave moves closer
    }

    // same as winTasks only for losing the wave
    loseTasks() {

    }

    gameHasStopped() {
        let v = app.laserCannon.destroyed;
        v = v || app.invaders.destroyed;
        v = v || (app.players[app.currentPlayer].lives == 0);
        return v;
    }

    clearScreenForMessages() {
        let stat = app.gameStatus;
        if (stat > GAME_HOLD_FOR_MESSAGE) {
            stat -= GAME_HOLD_FOR_MESSAGE;
        }
        if (stat == GAME_PLAYER_DEFEATED_WAVE ||
            stat == GAME_PLAYER_LOST_WAVE ||
            stat == GAME_PLAYER_LOST ||
            stat == GAME_PLAYER_LOST) {
            return true;
        }
        return false;
    }

    stopGame() {
        this.invaders.mystery.cancel();  // cancel any mystery ship timeouts
    }

    messageUserThenContinue(nowState,thenState) {
        if (this.msgTmr != null) {
            console.log("*** ERR:  msgTimer was not null in app.js");
            clearTimeout(this.msgTmr);
            this.msgTimr = null;
        }
        app.mode = nowState;
        this.msgTmr = setTimeout(() => {
            this.msgTmr = null;
            app.mode = thenState;
            this.nextWave();
        }, 5000);
    }

    setWaveCompleted(status) {
        //-----------------------------
        // stop this wave....
        //-----------------------------
        app.invaders.mystery.cancel();
        let player = this.players[this.currentPlayer];
        if (player.score > this.highScore) {
            this.highScore = player.score;
        }

        //--------------------------------------
        // update based on status...
        //--------------------------------------
        switch (status) {
            case GAME_IN_PROGRESS:
                break;
            case GAME_PLAYER_DEFEATED_WAVE:
                player.wavesCompleted++;
                app.gameStatus = GAME_HOLD_FOR_MESSAGE + GAME_PLAYER_DEFEATED_WAVE;
                this.messageUserThenContinue(MODE_HOLD_SCREEN_MSG,MODE_NEXT_WAVE);
                break;
            case GAME_PLAYER_LOST_WAVE:
                app.gameStatus = GAME_HOLD_FOR_MESSAGE + GAME_PLAYER_LOST_WAVE;
                if (player.lives > 0) {
                    player.lives--;
                    this.messageUserThenContinue(MODE_HOLD_SCREEN_MSG,MODE_NEXT_WAVE);
                } else {
                    this.messageUserThenContinue(MODE_HOLD_SCREEN_MSG,GAME_PLAYER_LOST);
                }
                break;
            case GAME_PLAYER_LOST:
                this.messageUserThenContinue(MODE_HOLD_SCREEN_MSG,GAME_PLAYER_LOST);
                break;
            case GAME_PLAYER_WON:
                console.log("what do we do now?  I don't know what it means to win!");
                break;
            case GAME_HOLD_FOR_MESSAGE:
                break;
            default:
                console.log("unknown wave status: " + status);
        }

        // TODO: next player logic


        if (player.lives == 0) {
            this.gameOver = true;
        }

    }
}
