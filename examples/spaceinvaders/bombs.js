/*jshint esversion: 6 */

class Bombs {
    constructor () {
        this.bombs = [];
        this.explosions = [];  // added when there's a hit
        this.hitx = 0;
        this.hity = 0;
    }

    fire(x,y) {
        let shot = new Bomb(x,y);
        this.bombs.push(shot);
    }

    show() {
        if (app.gameHasStopped()) {
            return;
        }
        for (var i = 0; i < this.bombs.length; i++) {
            this.bombs[i].show();
            this.bombs[i].move();
            if (this.bombs[i].expired) {
                this.bombs.splice(i,1);
            }
        }
        if (this.hitx != 0 && this.hity != 0) {
            image(app.explode,this.hitx,this.hity);
        }

        for (let i = 0; i < this.explosions.length; i++) {
            this.explosions[i].show();
        }
    }

    scanForHits() {
        for (var i = this.bombs.length - 1; i >= 0; i--) {
            if (app.laserCannon.overlaps(this.bombs[i])) {
                this.hitx = app.laserCannon.x;
                this.hity = app.laserCannon.y;
                app.laserCannon.destroyed = true;
                app.screen.statusMsg = "WAVE OVER  -  LASER CANNON DESTROYED";
                app.gameStatus = GAME_HOLD_FOR_MESSAGE;
                app.stopGame();
                this.explosions.push( new Explosion(this.hitx, this.hity,0,5000,concludeLostWave,this));
                return true;
            }
        }
        return false;
    }
}

function concludeLostWave(hts) {
    app.setWaveCompleted(GAME_PLAYER_LOST_WAVE); // player lost the :-(
}
