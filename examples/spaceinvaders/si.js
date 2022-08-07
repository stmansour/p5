app = {
    ship: null,
    invaders: null,
    a1: null,   // invader a image arms down
    a2: null,   // invader a image arms up
};

function preload() {
  app.a1 = loadImage('assets/a1.png');
  app.a2 = loadImage('assets/a2.png');
}

function setup() {
    var canvas = createCanvas(1200, 800);
    canvas.parent("theCanvas");
    app.ship = new Ship();
    app.invaders = new Invaders();
    app.invaders.init();
}

function draw() {
    background(0);
    app.ship.go();  // move before show
    app.ship.show();
    app.a1.loadPixels();
    app.a2.loadPixels();
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
