// This module contains all the functions that a user would find on the
// Space Invaders arcade console
//========================================================================
/*jshint esversion: 6 */

function onePlayer() {
    if (app.sound) { app.sound.ensureContext(); }
    if (app.gameOverTimer != null) {
        return; // don't do anything to change the final screen until the timer completes
    }
    if (app.credits < 1) {
        app.screen.insertCoinsShow = true;
        app.screen.insertCoins();
        return;
    }
    app.credits -= 1;
    app.mode = MODE_NEW_GAME_1_PLAYER;
    app.players = [];
    let p = new Player(1, 1);
    p.newGame();
    app.players.push(p);
    app.newGame();
    app.mode = MODE_NEW_GAME_1_PLAYER;
}

function twoPlayers() {
    if (app.sound) { app.sound.ensureContext(); }
    if (app.gameOverTimer != null) {
        return; // don't do anything to change the final screen until the timer completes
    }
    if (app.credits < 2) {
        app.screen.insertCoinsShow = true;
        app.screen.insertCoins();
        return;
    }
    app.credits -= 2;
    app.mode = MODE_NEW_GAME_2_PLAYERS;
    app.players = [];
    let p1 = new Player(1, 1);
    let p2 = new Player(1, 2);
    p1.newGame();
    p2.newGame();
    app.players.push(p1);
    app.players.push(p2);
    app.newGame();
}

function coinInserted() {
    if (app.sound) { app.sound.ensureContext(); }
    app.credits++;
    app.screen.showCredits();
}
