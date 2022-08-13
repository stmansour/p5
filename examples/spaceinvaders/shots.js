/*jshint esversion: 6 */

function Shots() {
    this.shots = [];

    this.fire = function() {
        let shot = new Shot(app.laserCannon.x,app.laserCannon.y);
        this.shots.push(shot);
    };

    this.show = function() {
        for (var i = 0; i < this.shots.length; i++) {
            this.shots[i].show();
            this.shots[i].move();
            if (this.shots[i].expired) {
                this.shots.splice(i,1);
            }
        }
    };

    this.scanForHits = function() {

        for (var i = this.shots.length - 1; i >= 0; i--) {
            let x1 = this.shots[i].x;
            let y1 = this.shots[i].y;
            let x2 = x1 + 2;
            let y2 = y1 + 10;

            if (app.invaders.mystery.hit(x1,y1,x2,y2)) {
                this.score(app.invaders.mystery.points);
                console.log('MYSTER SHIP HIT -- score: ' + app.invaders.mystery.points);
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
                        this.hit(i,j,k);
                    }
                }
            }
        }
    };

    this.hit = function(i,j,k) {
        // explode the invader in squadron j position k
        app.invaders.squadrons[j].ships[k].killed = true;
        app.invaders.squadrons[j].reassessStatus();
        this.shots.splice(i,1);
        this.score(app.invaders.squadrons[j].ships[k].points);
    };

    this.score = function(pts) {
        app.players[app.currentPlayer].score += pts;
        if (app.currentPlayer == 0) {
            app.screen.score1();
        } else {
            app.screen.score2();
        }
    };
}
