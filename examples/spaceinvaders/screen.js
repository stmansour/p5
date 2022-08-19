// This module contains all the functions to update the status of the screen
// area.  It does not play the game, but it indicates the score, tells the
// user how many lives they have, shows the number of credits, etc.
//
// campaigns contain ads, ads contain revealiers
//============================================================================
/*jshint esversion: 6 */

class SIScreen {
    constructor() {
        this.campaigns = [];
        this.adsIdx = 0;
        this.campaignsIdx = 0;
        this.adsInProgress = false;
        this.insertCoinsShow = false; // don't turn it on until the user trys to play without adding credits
        this.tmr = null;  // we'll leave the last message of an ad campaign up for a few seconds before moving to the next campaign
        this.statusMsg = "";
    }

    init() {
        let ads1 = [
            [   null, " PLAY SPACE INVADERS"],
            [   null, "*SCORE ADVANCE TABLE*"],
            [  app.d, "= ? MYSTERY"],
            [ app.c1, "= 30 POINTS"],
            [ app.a1, "= 20 POINTS"],
            [ app.b1, "= 10 POINTS"],
        ];
        let ads2 = [
            [   null, "INSERT COIN"],
            [   null, "<1 OR 2 PLAYERS>"],
            [   null, "*1 PLAYER  1 COIN"],
            [   null, "*2 PLAYERS 2 COINS"],
        ];
        let campaigns = [ ads1, ads2 ];

        let dy = 40;
        let x = 225;
        let dx = 25;
        for (let i = 0; i < campaigns.length; i++) {
            let ads = campaigns[i];
            let a = [];
            for (let j = 0; j < ads.length; j++) {
                let myx = x;
                if (ads[j][0] != null) {
                    myx += dx;
                }
                a.push(new Revealer( ads[j][0], ads[j][1], myx, 200 + j * dy, dy, 100, nextAdCB ));
            }
            this.campaigns.push(a);
        }
    }

    goAds() {
        if (this.adsInProgress || this.tmr != null) {
            return;
        }
        this.adsInProgress = true;
        this.nextAd();
    }

    nextAd() {
        if (this.adsIdx < this.campaigns[this.campaignsIdx].length) {
            this.campaigns[this.campaignsIdx][this.adsIdx].go();
        } else {
            //------------------------------------------------------
            // wait some time before switching to the next campaign
            //------------------------------------------------------
            this.tmr = setInterval(() => {
                this.clearAds();
                this.adsIdx = 0;
                this.campaignsIdx++;
                if (this.campaignsIdx >= this.campaigns.length) {
                    this.campaignsIdx = 0;
                }
                this.adsInProgress = false;
            }, 2000); // wait 2 secs
        }
    }

    clearAds() {
        for (let i = 0; i < this.campaigns.length; i++) {
            let ads = this.campaigns[i];
            for (let j = 0; j < ads.length; j++) {
                ads[j].reset();
            }
        }
        this.adsIdx = 0;
        this.adsInProgress = false;
        if (this.tmr != null) {
            clearInterval(this.tmr);
            this.tmr = null;
        }
    }

    showAds() {
        this.goAds(); // checks to see if it's already running
        for (let i = 0; i < this.campaigns[this.campaignsIdx].length; i++) {
            this.campaigns[this.campaignsIdx][i].show();
        }
    }

    show() {
        this.scores();
        this.bottomLine();
        switch (app.mode) {
            case MODE_NOT_PLAYING:
                this.insertCoins();
                this.showAds();
                app.screen.showSelectPlayers();
                break;
            case MODE_NEW_GAME_1_PLAYER:
            case MODE_NEW_GAME_2_PLAYERS:
            case MODE_HOLD_SCREEN_MSG:
            case MODE_NEXT_WAVE:
                this.lives();
                break;
        }

        let stat = app.gameStatus;
        if (stat > GAME_HOLD_FOR_MESSAGE) {
            stat -= GAME_HOLD_FOR_MESSAGE;
        }
        let s="";
        switch (stat) {
            case GAME_IN_PROGRESS:
                break;
            case GAME_PLAYER_DEFEATED_WAVE:
                this.statusMsg = "";
                let n = app.players[app.currentPlayer].wavesCompleted;
                s = "WAVES DEFEATED: " + n;
                fill(80, 255, 80);
                text(s, (width - textWidth(s)) / 2, 180);
                s = "WELL DONE";
                text(s, (width - textWidth(s)) / 2, 205);
                this.gameOver = true;
                break;
            case GAME_PLAYER_LOST_WAVE:
                this.statusMsg = "";
                if (app.players[app.currentPlayer].lives > 0) {
                    s = "PREPARE FOR NEXT WAVE";
                } else {
                    s = "YOU HAVE BEEN DEFEATED BY THE INVADERS -- SHAME ON YOU";
                }
                fill(255, 80, 80);
                text(s, (width - textWidth(s)) / 2, 180);
                s = "LIVES REMAINING: " + app.players[app.currentPlayer].lives;
                text(s, (width - textWidth(s)) / 2, 205);
                this.gameOver = true;
                break;
            case GAME_PLAYER_LOST:
                this.statusMsg = "";
                s = "YOU HAVE NO MORE LIVES";
                fill(255, 80, 80);
                text(s, (width - textWidth(s)) / 2, 180);
                this.gameOver = true;
                break;
            case GAME_PLAYER_WON:
                console.log("what do we do now?  I don't know what it means to win!");
                break;
            case GAME_HOLD_FOR_MESSAGE:
                fill(255, 80, 80);
                text(this.statusMsg, (width - textWidth(this.statusMsg)) / 2, 80);
                break;
            default:
                console.log("unknown wave status: " + status);
                break;
        }

        if (app.gameOver) {
            this.showGameOver();
        }
    }

    scores() {
        this.score1();
        this.score2();
        this.hiScore();
        this.showCredits();
    }

    showSelectPlayers() {
        noStroke();
        let s = "SELECT 1 OR 2 PLAYERS";
        textSize(app.cSize);
        fill(255, 80, 80);
        text(s, (width - textWidth(s)) / 2, 100);
    }


    showGameOver() {
        noStroke();
        let s = "GAME OVER";
        textSize(app.cSize);
        fill(255, 80, 80);
        text(s, (width - textWidth(s)) / 2, 150);

        // --------------------------------------------------------------------------
        // we need to leave the screen as it is for a few seconds so the user can
        // see the results of this game...
        // --------------------------------------------------------------------------
        if (app.gameOverTimer != null) {
            return; // if we've already set the timeout, return now so we don't set it again
        } else {
            app.mode = 3;
            // user should see the screen for 5 secs before we move on.
            app.gameOverTimer = setTimeout(() => {
                app.mode = 0;
                app.gameOverTimer = null;
                app.gameOver = false;
                app.screen.clearAds();
            }, 5000);
        }
    }

    score1() {
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
        let s = zeroFillNumber(score, 4);
        text(s, 145, app.topBar);
    }

    score2() {
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
        let s = zeroFillNumber(score, 4);
        text(s, width - textWidth(s) - 145, app.topBar);
    }

    hiScore() {
        var s = "HI-SCORE";
        noStroke();
        textSize(app.cSize);
        fill(255);
        text(s, (width - textWidth(s)) / 2, 25);
        s = zeroFillNumber(app.highScore, 4);
        text(s, (width - textWidth(s)) / 2, app.topBar);
    }

    showCredits() {
        let s = "CREDITS " + zeroFillNumber(app.credits, 2);
        text(s, (width - textWidth(s) - 25), height - 15);
    }

    lives() {
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

    // showWavesCompleted() {
    //     noStroke();
    //     textSize(app.cSize);
    //     fill(97, 201, 59);
    //     let player = app.players[app.currentPlayer];
    //     s = "WAVES COMPLETED: " + player.wavesCompleted;
    //     text(s,(width - textWidth(s))/2,75);
    // }

    insertCoins() {
        if (!this.insertCoinsShow) {
            return;
        }
        var s = "INSERT COINS TO GET CREDITS";
        noStroke();
        textSize(app.cSize);
        fill(255);
        text(s, 100, height - 15);
    }

    bottomLine() {
        stroke(97, 201, 59);
        strokeWeight(2);
        let y = app.bottomLineHeight;
        line(0, y, width, y);
    }
}

function nextAdCB() {
    app.screen.adsIdx++;
    app.screen.nextAd();
}
