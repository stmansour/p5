/*jshint esversion: 6 */

class Invader extends ImagePrimitive {
    constructor(x,y,img1,img2,pts) {
        super(x,y,img1,img2);
        this.points = pts;      // how many points is this invader worth
        this.killed = false;    // this invader has not yet been killed
        this.introduced = false;
    }

    show() {
        if (!this.killed) {
            super.show();
        }
    }
}
