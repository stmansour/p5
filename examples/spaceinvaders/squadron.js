// Squadron - a horizontal row of Invaders
//
// A squadron keeps track of:
//      Point Invaders - the leftmost and rightmost not-killed Invader in the list
//                       leftmost and rightmost could point to the same invader
//      leftmost         if there is only one left that is not killed.
//      rightmost        Both values will be null if all the invaders are killed.
//                       Note that in this case 'destroyed' will be true.
//
//      MoveDown         Set to true when rightmost.x is greater than the
//                       right edge, or when leftmost.x is less than the left edge.
//----------------------------------------------------------------------------------

/* esversion: 6 */

function Squadron(img1,img2,y,count,pts) {
    this.img1 = img1;
    this.img2 = img2;
    this.baseY = y;
    this.ships = [];
    this.points = pts;
    this.numShips = count;  // number of ships in this squadron
    this.leftmost = null;   // leftmost invader that is not killed
    this.rightmost = null;  // rightmost invader that is not killed
    this.direction = 1;     // multiplier, can be 1 or -1
    this.dx = 10;           // 10 pixels between ships
    this.destroyed = false; // true when all ships in the squadron have been killed
    this.directionChangeNeeded; // when one of the invaders is moved left of the left edge or right of the right edge

    this.reassessStatus = function() {
        if (this.destroyed) {
            return;
        }
        this.leftmost = null;
        this.rightmost = null;
        for (var i = 0; i < this.ships.length; i++) {
            let ship = this.ships[i];
            if (ship.killed) {
                continue;
            }
            if (this.leftmost == null) {
                this.leftmost = ship;
            }
            if (this.rightmost == null) {
                this.rightmost = ship;
            }
            if (ship.x > this.rightmost.x) {
                this.rightmost = ship;
            }
        }
        this.destroyed = (this.leftmost == null && this.rightmost == null);
        if (this.direction > 0 && this.rightmost != null) {
            this.directionChangeNeeded = this.rightmost.x + app.maxShipWidth + app.border > width;
        } else if (this.leftmost != null) {
            this.directionChangeNeeded = this.leftmost.x - app.border < 0;
        }
    }

    this.init = function() {
        let xSpacing = app.maxShipWidth + this.dx;
        let x = (width - (this.numShips * app.maxShipWidth + (this.numShips - 1)*this.dx))/2;
        let y = this.baseY;
        for (var i = 0; i < this.numShips; i++) {
            var inv = new Invader(x,y,this.img1,this.img2,this.points);
            this.ships.push(inv);
            x += xSpacing;
        }
        this.reassessStatus();
    }

    this.show = function() {
        if (this.destroyed) {
            return;
        }
        for (var i = 0; i < this.ships.length; i++) {
            this.ships[i].show();  // always show first
        }
    }
}
