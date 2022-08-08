function Invaders() {
    this.wing = [];     // in the airforce, a "wing" is a group of squadrons
    this.speed = 0;     // number of pixels to move left or right. Increases as number of players decreases
    this.idx = 0;       // index of the invader to move next
    this.shipsPerSquadron = 11; // the number of ships for each squadron
    this.totalShips = 0;
    this.shipMovesPerFrame = 1;
    this.shipsRemaining

    this.squadbuilder = function(i1,i2,y) {
        let squadron = new Squadron(i1,i2,y, this.shipsPerSquadron);
        squadron.init();
        this.wing.push(squadron);
    }

    this.setSpeed = function(x) {
        for (var i = 0; i < this.wing.length; i++) {
            this.wing[i].speed = x;
        }
        this.speed = x;
    }

    this.init = function() {
        let y = 100;
        let y1 = 40;
        this.squadbuilder(app.b1,app.b2,y+4*y1);
        this.squadbuilder(app.b1,app.b2,y+3*y1);
        this.squadbuilder(app.a1,app.a2,y+2*y1);
        this.squadbuilder(app.a1,app.a2,y+y1);
        this.squadbuilder(app.c1,app.c2,y);
        this.totalShips = this.shipsPerSquadron * this.wing.length;
        this.shipsRemaining = this.totalShips;
    }
    this.bumpIdx = function(){
        this.idx += 1;
        if (this.idx >= this.totalShips) {
            this.idx = 0;
        }
    }

    this.show = function() {
        //---------------------------------------------------------------------
        // to simulate the movement in the original game, we move one invader
        // at a time, then wait a certain number of frames before we move the
        // next one. This will speed things up over time too.
        // Plus, we'll start by doing this movement once every framemod frames
        //---------------------------------------------------------------------
        let idx = 0;    // search to find the invader we want to move (this.idx)
        let found = 0;  // we'll stop once we've moved shipMovesPerFrame
        for (var i = 0; i < this.wing.length && found < this.shipMovesPerFrame; i++) {
            let squadron = this.wing[i];
            for (var j = 0; j < squadron.ships.length && found < this.shipMovesPerFrame; j++) {
                let ship = squadron.ships[j]
                if (ship.killed) {
                    this.bumpIdx();  // we skip killed ships
                }
                if (idx == this.idx) {
                    // this is the guy we want to move
                    let dx = squadron.direction * squadron.speed;
                    ship.armsUp = !ship.armsUp; // we switch images when we move
                    ship.relativeMove(dx,0);
                    found += 1;
                    this.bumpIdx();  // we skip killed ships
                 }
                idx += 1; // keep looking
            }
        }

        //---------------------------------------------------------------
        // OK, all ships are in the correct position, render them...
        //---------------------------------------------------------------
        for (var i = 0; i < this.wing.length; i++) {
            let squadron = this.wing[i];
            squadron.show();
        }
    }
}
