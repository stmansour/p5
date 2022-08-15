/*jshint esversion: 6 */

class Graph {
    constructor(x1,y1,x2,y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.labelx = "";
        this.labely = "";
    }

    labels(lx,ly) {
        this.labelx = lx;
        this.labely = ly;
    }

    axes() {
        strokeWeight(1);
        stroke(128);
        line(this.x1, 0, this.x2, 0);     // x axis
        line(this.x2, 0, this.x2 -8, 4);
        line(this.x2, 0, this.x2 -8, -4);

        line(0, this.y1, 0, this.y2);      // y axis
        line(0,this.y1, -4, this.y1+8);
        line(0,this.y1,  4, this.y1+8);

        fill(128);
        noStroke();
        if (this.labelx.length > 0) {
            text(this.labelx, this.x2 - textWidth(this.labelx) - 10, 20);
        }
        if (this.labely.length > 0) {
            text(this.labely, -5-textWidth(this.labely), 20 - this.y2);
        }

    }
}
