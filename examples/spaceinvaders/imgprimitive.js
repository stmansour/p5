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

    show() {
        if (this.show1) {
            image(this.img1,this.x,this.y);
        } else {
            image(this.img2,this.x,this.y);
        }
    }
}
