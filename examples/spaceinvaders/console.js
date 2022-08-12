// This module contains all the functions that a user would find on the
// Space Invaders arcade console
//========================================================================
/*jshint esversion: 6 */

function onePlayer() {
    if (app.gameOverTimer != null) {
        return; // don't do anything to change the final screen until the timer completes
    }
    if (app.credits < 1) {
        insertCoins();
        return;
    }
    app.credits -= 1;
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
    if (app.credits < 2) {
        insertCoins();
        return;
    }
    app.credits -= 2;
    app.mode = 2;
    app.players = [];
    app.players.push(new Player(1)); // give him 1 credit
    app.players.push(new Player(1));
    newGame();
}

function coinInserted() {
    app.credits++;
    showCredits();
}
