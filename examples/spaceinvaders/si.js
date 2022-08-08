function preload() {
    loadImages();
}

function setup() {
    scale(0.5);
    var canvas = createCanvas(700, 800);
    canvas.parent("theCanvas");
    loadAllPixels();
    setMaxShipWidth();
    app.invaders = new Invaders();
    app.invaders.init();
    app.ship = new Ship();
    app.ship.init();
}

function draw() {
    background(0);
    app.ship.go();  // move before show
    app.ship.show();
    app.invaders.setSpeed(10);
    app.invaders.show();
}

function keyPressed() {
    switch( keyCode) {
        case RIGHT_ARROW:
            app.ship.goRight(true);
            break;
        case LEFT_ARROW:
            app.ship.goLeft(true);
            break;
    }
}
function keyReleased() {
    switch( keyCode) {
        case RIGHT_ARROW:
            app.ship.goRight(false);
            break;
        case LEFT_ARROW:
            app.ship.goLeft(false);
            break;
    }
}
