function Invader(x,y,img1,img2) {
    this.x = x;
    this.y = y;
    this.img1 = img1;
    this.img2 = img2;
    this.armsUp = false;    // start by drawing arms down
    this.killed = false;    // this invader has not yet been killed
    this.introduced = false;

    this.relativeMove = function (dx,dy) {
        this.x += dx;
        this.y += dy;
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
