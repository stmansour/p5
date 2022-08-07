function Invader(x,y) {
    this.x = x;
    this.y = y;
    this.armsUp = false;    // start by drawing arms down

    this.relativeMove = function (dx,dy) {
        this.x += dx;
        this.y += dy;
    }

    this.show = function() {
        if (this.armsUp) {
            image(app.a2, this.x, this.y);
        } else {
            image(app.a1, this.x, this.y);
        }
    }
}
