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
    app.ship.show();
}
