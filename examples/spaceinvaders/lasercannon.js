/*jshint esversion: 6 */

class LaserCannon extends ImagePrimitive {
    constructor() {
        super(0,0,app.cannon);
        this.width = 0;
        this.height = 0;
        this.movingLeft = false;
        this.movingRight = false;
        this.moveAmt = 8;
    }

    init() {
        app.cannon.loadPixels();
        this.width = app.cannon.width;
        this.height = app.cannon.height;
        this.y = height - this.height - 60;
        this.x = (width - this.width)/2;
        super.setOriginX(1); // center X
    }

    // this.show = function() {
    //     image(app.cannon, this.x - this.width/2, this.y);
    // };

    go() {
        var amt = this.moveAmt;
        if (this.movingLeft) {
            if (this.x - this.moveAmt < app.border) {
                amt = 0;
            }
            super.relativeMove(-amt,0);
        }
        if (this.movingRight) {
            if (this.x + this.moveAmt > width - app.border) {
                amt = 0;
            }
            super.relativeMove(amt,0);
        }
    }

    goLeft(t) {
        this.movingLeft = t;
    }

    goRight(t) {
        this.movingRight = t;
    }
}
