app = {
    a1: null,   // invader a image arms down
    a2: null,   // invader a image arms up
    b1: null,   // invader a image arms down
    b2: null,   // invader a image arms up
    c1: null,   // invader a image arms down
    c2: null,   // invader a image arms up
    cannon: null,  // the laser cannon image
    invaders: null,
    laserCannon: null,
    shots: null,
    maxShipWidth: 0,
    border: 30,
    topBar: 50,         // y limit of top area for messages/scores, etc.
    gameOver: false,
    gameOverTimer: null,
    players: [],        // array of player objects.
    currentPlayer: 0,   // during play, this can be 0 or 1
    hiScore: 0,
    cSize:  18,         // size of large characters
    font: null,
    mode: 0,    // 0 = not playing, 1 = 1 player, 2 = 2 players, 3 = freeze screen so user can see why they lost
};

function loadImages() {
    app.a1 = loadImage('assets/a1.png');
    app.a2 = loadImage('assets/a2.png');
    app.b1 = loadImage('assets/b1.png');
    app.b2 = loadImage('assets/b2.png');
    app.c1 = loadImage('assets/c1.png');
    app.c2 = loadImage('assets/c2.png');
    app.cannon = loadImage('assets/lasercannon.png');
    app.font = loadFont('assets/PixelSplitter-Bold.ttf');
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

function drawScreen() {
    background(0);
    scores();
    bottomLine();
    lives();
}

function onePlayer() {
    if (app.gameOverTimer != null) {
        return; // don't do anything to change the final screen until the timer completes
    }
    app.mode = 1;
    app.players = [];
    let p = new Player(1);
    p.newGame();
    app.players.push(p);
    newGame();
    app.mode = 1;
}

function twoPlayers() {
    if (app.gameOverTimer != null) {
        return; // don't do anything to change the final screen until the timer completes
    }
    app.mode = 2;
    app.players = [];
    app.players.push(new Player(1));  // give him 1 credit
    app.players.push(new Player(1));
    newGame();
}

function showSelectPlayers() {
    noStroke();
    let s = "SELECT 1 OR 2 PLAYERS";
    textSize(app.cSize);
    fill(255,80,80);
    text(s, (width - textWidth(s))/2,100);
}

function showGameOver() {
    noStroke();
    let s = "GAME OVER";
    textSize(app.cSize);
    fill(255,80,80);
    text(s, (width - textWidth(s))/2,150);

    //--------------------------------------------------------------------------
    // we need to leave the screen as it is for a few seconds so the user can
    // see the results of this game...
    //--------------------------------------------------------------------------
    if (app.gameOverTimer != null) {
        return // if we've already set the timeout, return now so we don't set it again
    } else {
        app.mode = 3;
        // user should see the screen for 5 secs before we move on.
        app.gameOverTimer = setTimeout( () => {
            app.mode = 0;
            app.gameOverTimer = null;
            app.gameOver = false;
        }, 5000);
    }
}

function scores() {
    score1();
    score2();
    hiScore();
}

function score1() {
    let player = null;
    let name = "SCORE<1>";
    let score = 0;
    if (app.mode != 0) {
        player = app.players[0];
        name = "SCORE"+player.name;
        score = player.score;
    }
    noStroke();
    textSize(app.cSize);
    fill(255);
    text(name, 145,25);
    s = zeroFillNumber(score,4);
    text(s, 145,app.topBar);
}

function score2() {
    if (app.mode == 1) {
        return;
    }
    let name = "SCORE<2>";
    let score = 0;
    if (app.mode == 2) {
        let player = app.players[1];
        name = "SCORE"+player.name;
        score = player.score;
    }
    noStroke();
    textSize(app.cSize);
    fill(255);
    text(name, width - textWidth(name) - 145,25);
    s = zeroFillNumber(score,4);
    text(s, width - textWidth(s) - 145,app.topBar);
}

function hiScore() {
    var s = "HI-SCORE"
    noStroke();
    textSize(app.cSize);
    fill(255);
    text(s, (width - textWidth(s))/2,25);
    s = zeroFillNumber(app.hiScore,4);
    text(s, (width - textWidth(s))/2,app.topBar);
}

function lives() {
    noStroke();
    textSize(app.cSize);
    fill(97,201,59);

    if (app.mode == 0) {
        let s = "CREDITS 00";
        text(s, (width - textWidth(s))/2,height - 15);
        return;
    }

    let player = app.players[app.currentPlayer];
    let y = height - 5;
    let livesRemaining = '' + player.lives;
    text('' + livesRemaining, 20, y);
    let x = 50;
    y = height - app.cannon.height - 5;
    for (let i = 0; i < livesRemaining-1; i++) {
        image(app.cannon,x,y);
        x += app.cannon.width + 5;
    }
}

function bottomLine() {
    stroke(97, 201, 59);
    strokeWeight(2);
    let y = height - app.cannon.height - 20;
    line(0,y,width,y);
}
