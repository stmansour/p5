app = {
    ship: null,
    invaders: null,
    a1: null,   // invader a image arms down
    a2: null,   // invader a image arms up
    b1: null,   // invader a image arms down
    b2: null,   // invader a image arms up
    c1: null,   // invader a image arms down
    c2: null,   // invader a image arms up
    cannon: null,  // the laser cannon
    maxShipWidth: 0,
    score: 0,
    lives: 3,
};

function loadImages() {
    app.a1 = loadImage('assets/a1.png');
    app.a2 = loadImage('assets/a2.png');
    app.b1 = loadImage('assets/b1.png');
    app.b2 = loadImage('assets/b2.png');
    app.c1 = loadImage('assets/c1.png');
    app.c2 = loadImage('assets/c2.png');
    app.cannon = loadImage('assets/lasercannon.png');
}

function loadAllPixels() {
    app.a1.loadPixels();
    app.a2.loadPixels();
    app.b1.loadPixels();
    app.b2.loadPixels();
    app.c1.loadPixels();
    app.c2.loadPixels();
}

function setMaxShipWidth() {
    app.maxShipWidth = app.a1.width;
    if (app.b1.width > app.maxShipWidth) {
        app.maxShipWidth = app.b1.width;
    }
    if (app.c1.width > app.maxShipWidth) {
        app.maxShipWidth = app.c1.width
    }
}
