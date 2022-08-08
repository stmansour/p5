function Squadron(img1,img2,y,count) {
    this.img1 = img1;
    this.img2 = img2;
    this.baseY = y;
    this.ships = [];
    this.numShips = count;  // number of ships in this squadron
    this.leftmost = null;   // leftmost invader that is not killed
    this.rightmost = null;  // rightmost invader that is not killed
    this.direction = 1;     // multiplier, can be 1 or -1
    this.speed = 1;         // number of pixels in the x direction to move each frame
    this.savedRightX = 0;    // when switching directions from the left to right, wait until rightmost x changes.
    this.goRightTriggered = false;   // set true when leftmost inv hits left edge, direction won't change until rightmost x has changed.
    this.border = 15;       // switch directions when we get this close to an edge

    this.init = function() {
        let shipsTotalWidth = this.numShips * app.maxShipWidth;
        let ship2shipX = app.maxShipWidth + 10;
        let x = (width - shipsTotalWidth - 2)/2;
        let y = this.baseY;

        for (var i = 0; i < this.numShips; i++) {
            var inv = new Invader(x,y,this.img1,this.img2);
            if (i == 0) {
                this.leftmost = inv;
                this.rightmost = inv;
            }
            this.ships.push(inv);
            x += ship2shipX;
            if (inv.x > this.rightmost.x) {
                this.rightmost = inv;
            }
        }
    }

    this.show = function() {
        this.setDirection();  // sets this.direction to 1 or -1 as needed
        for (var i = 0; i < this.ships.length; i++) {
            this.ships[i].show();  // always show first
        }
    }

    this.setDirection = function() {
        if (this.goRightTriggered && this.rightmost.x != this.savedRightX) {
            this.direction = 1;
            this.goRightTriggered = false;
            this.savedRightX = 0;
            return;
        }
        if (this.direction > 0) {
            if (this.rightmost.x + this.speed + app.maxShipWidth + 15 > width) {
                this.direction = -1;
            }
        } else {
            if (this.leftmost.x - this.speed - 15 < 0) {
                this.goRightTriggered = true;
                this.savedRightX = this.rightmost.x; // we'll be waiting for this to change
            }
        }
    }
}
