/*jshint esversion: 6 */

class Shots {
    constructor () {
        this.shots = [];
        this.explosions = [];  // added when there's a hit
    }

    fire() {
        let shot = new Shot(app.laserCannon.x,app.laserCannon.y);
        this.shots.push(shot);
    }

    show() {
        for (var i = 0; i < this.shots.length; i++) {
            this.shots[i].show();
            this.shots[i].move();
            if (this.shots[i].expired) {
                this.shots.splice(i,1);
            }
        }
        for (let i = 0; i < this.explosions.length; i++) {
            this.explosions[i].show();
        }
    }

    scanForHits() {
        for (var i = this.shots.length - 1; i >= 0; i--) {
            let x1 = this.shots[i].x;
            let y1 = this.shots[i].y;
            let x2 = x1 + 2;
            let y2 = y1 + 10;

            if (app.invaders.mystery.hit(x1,y1,x2,y2)) {
                this.score(app.invaders.mystery.points);
                this.explosions.push( new Explosion(app.invaders.mystery.x,app.invaders.mystery.y,app.invaders.mystery.points,1000,cleanOutExplosions,this));
            }

            for (var j = app.invaders.squadrons.length - 1; j >= 0; j--) {
                let squad = app.invaders.squadrons[j];
                if (squad.destroyed) {
                    continue;
                }
                for (var k = squad.ships.length - 1; k >= 0; k--) {
                    let ship = squad.ships[k];
                    if (ship.killed) {
                        continue;
                    }
                    let sx1 = ship.x;
                    let sy1 = ship.y;
                    let sx2 = sx1 + ship.img1.width;
                    let sy2 = sy1 + ship.img1.height;
                    if (sx2 >= x1 && sx1 < x2 && sy2 >= y1 && sy1 < y2) {
                        this.hit(i,j,k,sx1,sy1);
                    }
                }
            }
        }
    }

    hit(i,j,k,x,y) {
        // explode the invader in squadron j position k
        app.invaders.squadrons[j].ships[k].killed = true;
        app.invaders.squadrons[j].reassessStatus();
        this.shots.splice(i,1);
        this.explosions.push( new Explosion(x,y,0,400,cleanOutExplosions,this));
        this.score(app.invaders.squadrons[j].ships[k].points);
    }

    score(pts) {
        app.players[app.currentPlayer].score += pts;
        if (app.currentPlayer == 0) {
            app.screen.score1();
        } else {
            app.screen.score2();
        }
    }
}

function cleanOutExplosions(hts) {
    for (var i = hts.explosions.length - 1; i >= 0; i--) {
        if (hts.explosions[i].expired) {
            hts.explosions.splice(i,1);
        }
    }
}
