/*jshint esversion: 6 */

let app = null;

function preload() {
    app = new SpaceInvadersApp();
    app.loadImages();
}

function setup() {
    scale(0.5);
    var canvas = createCanvas(640, 540);
    canvas.parent("theCanvas");
    app.loadAllPixels();
    app.setMaxShipWidth();
    textFont(app.font);
    app.mode = MODE_NOT_PLAYING; // initialization; being very explicit
    app.screen.init();
}

function draw() {
    background(0);

    switch (app.mode) {
        case MODE_NOT_PLAYING:
            app.screen.showSelectPlayers();
            break;
        case MODE_NEW_GAME_1_PLAYER:
        case MODE_NEW_GAME_2_PLAYERS:
        case MODE_HOLD_SCREEN_MSG:
        case MODE_NEXT_WAVE:
            app.setSpeed();
            app.shots.show();
            app.shots.scanForHits();
            app.invaders.show();
            app.invaders.scanForHits();
            if (app.invaders.introduced) {
                app.laserCannon.go(); // move before show
                app.laserCannon.show();
            }
            break;
        default:
            console.log("unknown mode: " + app.mode);
            break;
    }

    app.screen.show();
}

function keyPressed() {
    switch (keyCode) {
        case RIGHT_ARROW:
        case 190:
            app.laserCannon.goRight(true);
            break;
        case LEFT_ARROW:
        case 188:
            app.laserCannon.goLeft(true);
            break;
        case 32:
            /* SPACE */
            app.shots.fire();
            break;
    }
}

function keyReleased() {
    switch (keyCode) {
        case RIGHT_ARROW:
        case 190:
            app.laserCannon.goRight(false);
            break;
        case LEFT_ARROW:
        case 188:
            app.laserCannon.goLeft(false);
            break;
        default:
            // console.log('keyCode = ' + keyCode);
            break;
    }
}
