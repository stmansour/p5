function preload() {
    loadImages();
}

function newGame() {
    app.invaders = new Invaders();
    app.invaders.init();
    app.invaders.speed = 5; // each horizontal move is this many pixels
    app.laserCannon = new LaserCannon();
    app.laserCannon.init();
    app.shots = new Shots();
}

function setup() {
    scale(0.5);
    var canvas = createCanvas(640, 480);
    canvas.parent("theCanvas");
    loadAllPixels();
    setMaxShipWidth();
    textFont(app.font);
    app.mode = 0; // being very explicit
}

function draw() {
    drawScreen();

    if (app.mode > 0) {
        app.shots.show();
        app.invaders.show();
        if (app.invaders.introduced) {
            app.laserCannon.go(); // move before show
            app.laserCannon.show();
        }
    } else {
        showSelectPlayers();
    }

    if (app.gameOver) {
        showGameOver();
    }
}

function keyPressed() {
    switch (keyCode) {
        case RIGHT_ARROW:
            app.laserCannon.goRight(true);
            break;
        case LEFT_ARROW:
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
            app.laserCannon.goRight(false);
            break;
        case LEFT_ARROW:
            app.laserCannon.goLeft(false);
            break;
        default:
            // console.log('keyCode = ' + keyCode);
            break;
    }
}
