

class FPT {
    constructor(field) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.realval = 0;
        this.val = 0;
        this.row = 0;
        this.col = 0;
        this.name = "";
        this.field = field; // the field to which this FPT belongs
    }

    draw() {
        noStroke();
        if (this.field.mappedColor) {
            fill(this.val * 255);
        } else {
            fill(this.realval * 255);
        }
        rect(this.x - rez2, this.y - rez2, rez, rez);
    }
    drawDot() {
        noStroke();
        fill(127);
        rect(this.x - rez2, this.y - rez2, rez, rez);
        if (this.field.mappedColor) {
            fill(this.val * 255);
        } else {
            fill(this.realval * 255);
        }
        ellipse(this.x, this.y, rez2);
    }

    drawGrid() {
        noFill();
        stroke(63);
        rect(this.x - rez2, this.y - rez2, rez, rez);
        stroke(255 * 3 / 4);
        strokeWeight(1);
    }

    // getState determins which line to draw based on the surrounding "dots".
    // Note:
    // I'm not sure how javascript represents its numbers. If this operation
    // was being done on an integers, we could do this differently. For now,
    // we're just going to do a brute-force method...
    //------------------------------------------------------------------------
}
