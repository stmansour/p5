// This module contains all the functions to update the status of the screen
// area.  It does not play the game, but it indicates the score, tells the
// user how many lives they have, shows the number of credits, etc.
//============================================================================

let ad1 = null;
function screeninit() {
    ad1 = new Revealer("PLAY SPACE INVADERS",200,200,100);
    ad1.go();
}

function drawScreen() {
    background(0);
    scores();
    bottomLine();
    switch (app.mode) {
        case 0:
            insertCoins();
            ad1.show();
            break;
        case 1:
            lives();
            break;
        case 2:
            lives();
            break;
    }

    if (app.gameOver) {
        showGameOver();
    }
}

function scores() {
    score1();
    score2();
    hiScore();
    showCredits();
}

function showSelectPlayers() {
    noStroke();
    let s = "SELECT 1 OR 2 PLAYERS";
    textSize(app.cSize);
    fill(255, 80, 80);
    text(s, (width - textWidth(s)) / 2, 100);
}

function showGameOver() {
    noStroke();
    let s = "GAME OVER";
    textSize(app.cSize);
    fill(255, 80, 80);
    text(s, (width - textWidth(s)) / 2, 150);

    if (app.gameStatus == 1) {
        s = "*** YOU WIN ***";
        fill(80, 255, 80);
        text(s, (width - textWidth(s)) / 2, 180);
    } else if (app.gameStatus == 2) {
        s = "YOU LOSE";
        fill(255, 80, 80);
        text(s, (width - textWidth(s)) / 2, 180);
    }

    //--------------------------------------------------------------------------
    // we need to leave the screen as it is for a few seconds so the user can
    // see the results of this game...
    //--------------------------------------------------------------------------
    if (app.gameOverTimer != null) {
        return // if we've already set the timeout, return now so we don't set it again
    } else {
        app.mode = 3;
        // user should see the screen for 5 secs before we move on.
        app.gameOverTimer = setTimeout(() => {
            app.mode = 0;
            app.gameOverTimer = null;
            app.gameOver = false;
        }, 5000);
    }
}

function score1() {
    let player = null;
    let name = "SCORE<1>";
    let score = 0;
    if (app.mode != 0) {
        player = app.players[0];
        name = "SCORE" + player.name;
        score = player.score;
    }
    noStroke();
    textSize(app.cSize);
    fill(255);
    text(name, 145, 25);
    s = zeroFillNumber(score, 4);
    text(s, 145, app.topBar);
}

function score2() {
    if (app.mode == 1) {
        return;
    }
    let name = "SCORE<2>";
    let score = 0;
    if (app.mode == 2) {
        let player = app.players[1];
        name = "SCORE" + player.name;
        score = player.score;
    }
    noStroke();
    textSize(app.cSize);
    fill(255);
    text(name, width - textWidth(name) - 145, 25);
    s = zeroFillNumber(score, 4);
    text(s, width - textWidth(s) - 145, app.topBar);
}

function hiScore() {
    var s = "HI-SCORE"
    noStroke();
    textSize(app.cSize);
    fill(255);
    text(s, (width - textWidth(s)) / 2, 25);
    s = zeroFillNumber(app.highScore, 4);
    text(s, (width - textWidth(s)) / 2, app.topBar);
}

function showCredits() {
    let s = "CREDITS " + zeroFillNumber(app.credits, 2);
    text(s, (width - textWidth(s) - 25), height - 15);
}

function lives() {
    if (app.mode != 1 && app.mode != 2) {
        return;
    }
    noStroke();
    textSize(app.cSize);
    fill(97, 201, 59);
    let player = app.players[app.currentPlayer];
    let y = height - 5;
    let livesRemaining = '' + player.lives;
    text('' + livesRemaining, 20, y);
    let x = 50;
    y = height - app.cannon.height - 5;
    for (let i = 0; i < livesRemaining - 1; i++) {
        image(app.cannon, x, y);
        x += app.cannon.width + 5;
    }
}

function insertCoins() {
    var s = "INSERT COINS TO GET CREDITS"
    noStroke();
    textSize(app.cSize);
    fill(255);
    text(s, 100, height - 15);
}

function bottomLine() {
    stroke(97, 201, 59);
    strokeWeight(2);
    let y = height - app.cannon.height - 20;
    line(0, y, width, y);
}
