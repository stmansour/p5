/*jshint esversion: 6 */

function Invaders() {
    this.squadrons = [];        // in the airforce, a "squadrons" is a group of squadrons
    this.shipsPerSquadron = 11; // the number of ships for each squadrons
    this.speed = 1;             // number of pixels to move left or right.
    this.sqIdx = 0;             // index squadrons being shown
    this.invIdx = 0;            // index of invader within the squadrons being shown
    this.dy = 20;               // how much we move down each drop
    this.moveVertical = false;  // set to true at the edges when we need to lower the squadrons and change direction
    this.introduced = false;    // a OneShot... true after all ships have been shown once.
    this.mystery = null;        // shows up at random every 15 - 30 sec, value 100 - 500 points

    this.squadbuilder = function(i1, i2, y, pts) {
        let squadron = new Squadron(i1, i2, y, this.shipsPerSquadron, pts);
        squadron.init();
        this.squadrons.push(squadron);
    };

    this.init = function() {
        // let y = 200;    // game over fast
        let y = 100; // normal play
        let y1 = 40;
        this.squadbuilder(app.b1, app.b2, y + 4 * y1, 10);
        this.squadbuilder(app.b1, app.b2, y + 3 * y1, 10);
        this.squadbuilder(app.a1, app.a2, y + 2 * y1, 20);
        this.squadbuilder(app.a1, app.a2, y + y1, 20);
        this.squadbuilder(app.c1, app.c2, y, 30);
        this.mystery = new MysteryShip();
    };

    this.nextInvader = function() {
        this.invIdx += 1;
        if (this.invIdx >= this.squadrons[this.sqIdx].ships.length) {
            this.invIdx = 0;
            this.sqIdx += 1;
            if (this.sqIdx >= this.squadrons.length) {
                this.sqIdx = 0;
            }
        }
    };


    this.show = function() {
        if (app.gameOver) {
            this.showInvaders();
            return;
        }

        if (this.checkDestroyed()) {
            return;
        }

        let invaderMoved = false;
        let passComplete = false; // will be true if nextInvader points back to the first squadrons, first invader

        if (!this.introduced) {
            // just turn them on one-by-one...
            this.squadrons[this.sqIdx].ships[this.invIdx].introduced = true;
            this.nextInvader();
            invaderMoved = true;
            passComplete = (this.sqIdx == 0 && this.invIdx == 0);
        } else {
            //---------------------------------------------------------------------
            // to simulate the movement in the original game:
            //      * move one squadrons at a time, and one invader at a time
            //        within the squadrons
            //      * after moving all invaders (passComplete = true) have
            //        squadrons adjust their guidance
            //      * check to see if all the invaders need to drop down one row
            //        and move them down if needed.
            //---------------------------------------------------------------------
            do {
                let squadrons = this.squadrons[this.sqIdx];
                let ship = squadrons.ships[this.invIdx];
                if (!ship.killed) {
                    if (this.moveVertical) {
                        ship.relativeMove(0, this.dy);
                    } else {
                        ship.relativeMove(squadrons.direction * this.speed, 0);
                    }
                    this.checkCollisions();
                    invaderMoved = true;
                }
                this.nextInvader();
                passComplete = (this.sqIdx == 0 && this.invIdx == 0);
            } while (!invaderMoved && !passComplete);
        }

        this.showInvaders();

        //-------------------------------------------------------------------
        // If the invaders just completed introducing themselves onto the
        // screen then mark that the introduction is complete
        //-------------------------------------------------------------------
        if (passComplete && !this.introduced) {
            this.introduced = true;
            this.mystery.go();
        }

        if (passComplete && this.introduced) {
            for (let i = 0; i < this.squadrons.length; i++) {
                this.squadrons[i].reassessStatus();
            }
            if (this.moveVertical) {
                this.moveVertical = false;
                for (let i = 0; i < this.squadrons.length; i++) {
                    this.squadrons[i].direction = -this.squadrons[i].direction;
                    this.squadrons[i].directionChangeNeeded = false;
                }
            } else {
                for (let i = this.squadrons.length - 1; i >= 0; i--) {
                    if (this.squadrons[i].destroyed) {
                        continue;
                    }
                    this.moveVertical = this.squadrons[i].directionChangeNeeded;
                    break; // no need to look further
                }
            }
        }
    };

    this.showInvaders = function() {
        for (var i = 0; i < this.squadrons.length; i++) {
            let squadron = this.squadrons[i];
            squadron.show();
        }
        this.mystery.show();
    };

    this.checkCollisions = function() {
        //-----------------------------------------------
        // did any invader hit the laserCannon?
        //-----------------------------------------------
        let x1 = app.laserCannon.x;
        let x2 = app.laserCannon.x + app.cannon.width;
        let y1 = app.laserCannon.y;
        let y2 = app.laserCannon.y + app.cannon.height;
        for (let i = 0; i < this.squadrons.length && !app.gameOver; i++) {
            let squadron = this.squadrons[i];
            if (squadron.destroyed) {
                continue;
            }
            for (var j = 0; j < squadron.ships.length && !app.gameOver; j++) {
                ship = squadron.ships[j];
                let xcheck = ship.x + ship.img1.width >= x1 && ship.x < x2;
                let ycheck = ship.y + ship.img1.height > y1;
                if (xcheck && ycheck) {
                    app.setGameOver(2); // player lost
                }
            }
        }
    };

    this.checkDestroyed = function() {
        for (let i = 0; i < this.squadrons.length; i++) {
            if (!this.squadrons[i].destroyed) {
                return false;
            }
        }
        app.setGameOver(1); // player wins!
        return true;
    };
}
