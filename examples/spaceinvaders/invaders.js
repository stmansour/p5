function Invaders() {
    this.squadrons = []; // in the airforce, a "squadrons" is a group of squadrons
    this.shipsPerSquadron = 11; // the number of ships for each squadron
    this.speed = 1; // number of pixels to move left or right.
    this.sqIdx = 0; // index squadron being shown
    this.invIdx = 0; // index of invader within the squadron being shown
    this.dy = 20; // how much we move down each drop
    this.moveVertical = false; // set to true at the edges when we need to lower the squadrons and change direction

    this.squadbuilder = function(i1, i2, y) {
        let squadron = new Squadron(i1, i2, y, this.shipsPerSquadron);
        squadron.init();
        this.squadrons.push(squadron);
    };

    this.init = function() {
        let y = 100;
        let y1 = 40;
        this.squadbuilder(app.b1, app.b2, y + 4 * y1);
        this.squadbuilder(app.b1, app.b2, y + 3 * y1);
        this.squadbuilder(app.a1, app.a2, y + 2 * y1);
        this.squadbuilder(app.a1, app.a2, y + y1);
        this.squadbuilder(app.c1, app.c2, y);
    };

    this.nextInvader = function() {
        this.invIdx += 1;
        if (this.invIdx >= this.shipsPerSquadron) {
            this.invIdx = 0
            this.sqIdx += 1;
            if (this.sqIdx >= this.squadrons.length) {
                this.sqIdx = 0;
            }
        }
    };

    this.show = function() {
        //---------------------------------------------------------------------
        // to simulate the movement in the original game:
        //      * move one squadron at a time, and one invader at a time
        //        within the squadron
        //      * after moving all invaders have squadrons adjust their guidance
        //      * check to see if a drop is needed, and if so do the drop
        //      * repeat
        //---------------------------------------------------------------------
        let invaderMoved = false;
        let passComplete = false; // will be true if nextInvader points back to the first squadron, first invader
        do {
            let squadron = this.squadrons[this.sqIdx]
            let ship = squadron.ships[this.invIdx];
            if (!ship.killed) {
                if (this.moveVertical) {
                    ship.relativeMove(0, this.dy);
                } else {
                    ship.relativeMove(squadron.direction * this.speed, 0);
                }
                invaderMoved = true;
            }
            this.nextInvader();
            passComplete = (this.sqIdx == 0 && this.invIdx == 0);
        } while (!invaderMoved && !passComplete);

        if (invaderMoved) {
            for (var i = 0; i < this.squadrons.length; i++) {
                let squadron = this.squadrons[i];
                squadron.show();
            }

            //-------------------------------------------------------------------
            // Check special conditions
            //-------------------------------------------------------------------
            if (passComplete) {
                for (let i = 0; i < this.squadrons.length; i++) {
                    this.squadrons[i].adjustGuidance();
                }

                if (this.moveVertical) {
                    this.moveVertical = false;
                    for (var i = 0; i < this.squadrons.length; i++) {
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
        }
    };
}
