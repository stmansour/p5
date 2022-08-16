/*jshint esversion: 6 */

function Invader(x,y,img1,img2,pts) {
    this.x = x;
    this.y = y;
    this.img1 = img1;
    this.img2 = img2;
    this.points = pts;      // how many points is this invader worth
    this.armsUp = false;    // start by drawing arms down
    this.killed = false;    // this invader has not yet been killed
    this.introduced = false;

    this.tooFarLeft = function() {
        return (this.x < 5);
    };

    this.tooFarRight = function() {
        return (this.x + this.img1.width > width - 5);
    };

    this.relativeMove = function (dx,dy) {
        this.x += dx;
        this.y += dy;
        if (this.tooFarRight()) {
            this.x = width -5 - this.img1.width;
        }
        if (this.tooFarLeft()) {
            this.x = 5;
        }
        this.armsUp = !this.armsUp;  // switch images when we move
    };

    this.show = function() {
        if (this.killed || !this.introduced) {
            return;
        }
        if (this.armsUp) {
            image(this.img2, this.x, this.y);
        } else {
            image(this.img1, this.x, this.y);
        }
    };
}
