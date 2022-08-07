function Invaders() {
    this.ships = [];
    this.numShips = 9;
    this.chgImageCount = 8; // change images every this many frames
    this.chgImage = 0;      // switch every chgImageCount frames
    this.leftmost = null;
    this.rightmost = null;
    this.dxm = 1; // multiplier, can be 1 or -1
    this.dx = 3;  // number of pixels in the x direction to move each frame

    this.init = function() {
        app.a1.loadPixels();
        app.a2.loadPixels();
        let shipsTotalWidth = this.numShips * app.a1.width;
        let ship2shipX = app.a1.width + 10;
        let x = (width - shipsTotalWidth - 2)/2;
        let y = 100; // for now

        for (var i = 0; i < this.numShips; i++) {
            var inv = new Invader(x,y);
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
        this.setDeltas();  // sets this.dxm to 1 or -1 as needed
        let dx = this.dxm * this.dx;
        this.chgImage += 1;

        for (var i = 0; i < this.ships.length; i++) {
            this.ships[i].show();  // always show first
            this.ships[i].relativeMove(dx,0);
            if (this.chgImage >= this.chgImageCount) {
                this.ships[i].armsUp = !this.ships[i].armsUp;
            }
        }
        if (this.chgImage >= this.chgImageCount) {
            this.chgImage = 0;
        }
    }

    this.setDeltas = function() {
        if (this.dxm > 0) {
            if (this.rightmost.x + this.dx + app.a1.width + 15 > width) {
                this.dxm = -1;
            }
        } else {
            if (this.leftmost.x - this.dx - 15 < 0) {
                this.dxm = 1;
            }
        }
    }
}
