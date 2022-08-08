function Invader(x,y,img1,img2) {
    this.x = x;
    this.y = y;
    this.img1 = img1;
    this.img2 = img2;
    this.armsUp = false;    // start by drawing arms down
    this.killed = false;    // this invader has not yet been killed

    this.relativeMove = function (dx,dy) {
        this.x += dx;
        this.y += dy;
    }

    this.show = function() {
        if (this.killed) {
            return;
        }
        if (this.armsUp) {
            image(this.img2, this.x, this.y);
        } else {
            image(this.img1, this.x, this.y);
        }
    }
}
