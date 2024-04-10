/* jshint esversion: 6 */

class Obstacles {
    constructor(n) {
        this.o = [];
        for (let i = 0; i < n; i++) {
            this.o.push(new Obstacle() );
        }
    }

    show() {
        for (let i = 0; i < this.o.length; i++) {
            this.o[i].show();
        }
    }

    overlap(r) {
        for (let i = 0; i < this.o.length; i++) {
            if (this.o[i].overlap(r)) {
                return true;
            }

        }

        return false;
    }
}
