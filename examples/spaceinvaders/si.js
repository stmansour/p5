function preload() {
    loadImages();
}

function setup() {
    scale(0.5);
    var canvas = createCanvas(700, 600);
    canvas.parent("theCanvas");
    loadAllPixels();
    setMaxShipWidth();
    app.invaders = new Invaders();
    app.invaders.init();
    app.invaders.speed = 5; // each horizontal move is this many pixels
    app.laserCannon = new LaserCannon();
    app.laserCannon.init();
}

function draw() {
    drawScreen();
    app.laserCannon.go();  // move before show
    app.laserCannon.show();
    app.invaders.show();
}

function keyPressed() {
    switch( keyCode) {
        case RIGHT_ARROW:
            app.laserCannon.goRight(true);
            break;
        case LEFT_ARROW:
            app.laserCannon.goLeft(true);
            break;
    }
}
function keyReleased() {
    switch( keyCode) {
        case RIGHT_ARROW:
            app.laserCannon.goRight(false);
            break;
        case LEFT_ARROW:
            app.laserCannon.goLeft(false);
            break;
        case 32: /* SPACE */
            console.log("*** FIRE! ***");
            break;
        default:
            console.log('keyCode = ' + keyCode);
            break;
    }
}
