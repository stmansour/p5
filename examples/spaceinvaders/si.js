app = {
    ship: null,
};


function setup() {
    var canvas = createCanvas(800, 500);
    canvas.parent("theCanvas");
    app.ship = new Ship();
}

function draw() {
    background(0);
    app.ship.go();  // move before show
    app.ship.show();
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
