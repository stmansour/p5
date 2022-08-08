function Squadron(img1,img2,y,count) {
    this.img1 = img1;
    this.img2 = img2;
    this.baseY = y;
    this.ships = [];
    this.numShips = count;  // number of ships in this squadron
    this.leftmost = null;
    this.rightmost = null;
    this.direction = 1; // multiplier, can be 1 or -1
    this.speed = 1;  // number of pixels in the x direction to move each frame

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
        this.setDeltas();  // sets this.direction to 1 or -1 as needed
        this.chgImage += 1;

        for (var i = 0; i < this.ships.length; i++) {
            this.ships[i].show();  // always show first
        }
    }

    this.setDeltas = function() {
        if (this.direction > 0) {
            if (this.rightmost.x + this.speed + app.maxShipWidth + 15 > width) {
                this.direction = -1;
            }
        } else {
            if (this.leftmost.x - this.speed - 15 < 0) {
                this.direction = 1;
            }
        }
    }
}
