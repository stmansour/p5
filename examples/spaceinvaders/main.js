/*jshint esversion: 6 */

let app = null;
let gameCanvas = null;

const GAME_WIDTH = 640;
const GAME_HEIGHT = 540;
const GAME_WINDOW_PADDING = 16;

function preload() {
    app = new SpaceInvadersApp();
    app.loadImages();
}

function setup() {
    gameCanvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
    gameCanvas.parent("theCanvas");
    gameCanvas.elt.style.imageRendering = "pixelated";
    gameCanvas.elt.style.imageRendering = "crisp-edges";
    fitCanvasToWindow();
    app.loadAllPixels();
    app.setMaxShipWidth();
    textFont(app.font);
    app.screen.init();
    app.startSplash();
}

function fitCanvasToWindow() {
    if (!gameCanvas) {
        return;
    }

    let canvasBounds = gameCanvas.elt.getBoundingClientRect();
    let availableWidth = windowWidth - GAME_WINDOW_PADDING;
    let availableHeight = windowHeight - canvasBounds.top - GAME_WINDOW_PADDING;
    let canvasScale = min(availableWidth / GAME_WIDTH, availableHeight / GAME_HEIGHT);

    canvasScale = max(0.1, canvasScale);
    gameCanvas.elt.style.width = (GAME_WIDTH * canvasScale) + "px";
    gameCanvas.elt.style.height = (GAME_HEIGHT * canvasScale) + "px";
}

function windowResized() {
    fitCanvasToWindow();
}

function draw() {
    background(0);

    if (app.splashExpired()) {
        app.finishSplash();
    }

    switch (app.mode) {
        case MODE_SPLASH:
            break;
        case MODE_NOT_PLAYING:
            app.screen.showSelectPlayers();
            break;
        case MODE_NEW_GAME_1_PLAYER:
        case MODE_NEW_GAME_2_PLAYERS:
        case MODE_HOLD_SCREEN_MSG:
        case MODE_NEXT_WAVE:
            app.setSpeed();
            if (app.bunkers) { app.bunkers.show(); }
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
    if (app.mode == MODE_SPLASH) {
        app.finishSplash();
        return;
    }
    if (!app.laserCannon) {
        return;
    }

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
    if (!app.laserCannon) {
        return;
    }

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

function mousePressed() {
    if (app.mode == MODE_SPLASH) {
        app.finishSplash();
    }
}
