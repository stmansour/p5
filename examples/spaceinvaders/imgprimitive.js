/*jshint esversion: 6 */
class ImagePrimitive {
    constructor(x,y,img1,img2) {
        if (typeof img2 === 'undefined') {
            img2 = null;
        }
        this.x = x;
        this.y = y;
        this.img1 = img1;
        this.img2 = img2;
        this.show1 = true;
        this.originX = 0;  // 0 = left, 1 = center
    }

    setOriginX(o) {
        this.originX = o;
    }

    tooFarLeft() {
        return (this.x < 5);
    }

    tooFarRight() {
        return (this.x + this.img1.width > width - 5);
    }

    relativeMove(dx,dy) {
        this.x += dx;
        this.y += dy;
        if (this.tooFarRight()) {
            this.x = width -5 - this.img1.width;
        }
        if (this.tooFarLeft()) {
            this.x = 5;
        }
        this.show1 = !this.show1;  // switch images when we move
    }

    xOffset() {
        if (this.originX == 1) {
            return -this.img1.width/2;
        }
        return 0;
    }

    show() {
        let xoff = this.xOffset();
        let img = (this.img2 == null) ? this.img1 : ((this.show1) ? this.img1 : this.img2);
        image(img,this.x + xoff,this.y);
    }

    bounds() {
        let xoff = this.xOffset();
        return [this.x + xoff, this.y, this.x + this.img1.width + xoff, this.y + this.img1.height];
    }

    // all the overlap cases:
    //                     x1                  x2
    //                      *------------------*
    //    *-----*        *----*   *------*    *----*  *-------*
    //    s1    s2       s3   s4  s5     s6   s7   s8 s9      s10
    //               *-------------------------------*
    //               s11                             s12
    //------------------------------------------------------------------
    overlap(b) {
        let x1 = this.x;
        let y1 = this.y;
        let x2 = x1 + this.img1.width;
        let y2 = y1 + this.img1.height;

        let sx1 = b[0];
        let sy1 = b[1];
        let sx2 = b[2];
        let sy2 = b[3];

        if ( (sx1 < x2) && (sx2 >= x1) ) {
            return (sy1 < y2) && (sy2 >= y1);
        }
        return false;
    }
}
