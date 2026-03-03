

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

    drawConnectors() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                //               a                     b
                // line(this.x , this.y - rez2, this.x, this.y + rez);
                // line(this.x - rez2, this.y, this.x + rez, this.y);
                //               c                     d
                let a = createVector(this.x + rez2, this.y);        // between i,j and i,j+1
                let b = createVector(this.x + rez, this.y + rez2);  // between i,j+1 and i+1,j+1
                let c = createVector(this.x + rez2, this.y + rez);  // between i+1,j+1 and i,j+1
                let d = createVector(this.x, this.y + rez2);        // between i,j+1 and i,j

                let state = getState(
                    this.val,
                    (j + 1) < cols ? field.get(i, j + 1).val : 0,                       // assume 0 if out of bounds
                    (i + 1) < rows && (j + 1) < cols ? field.get(i + 1, j + 1).val : 0, // assume 0 if out of bounds
                    (i + 1) < rows ? field.get(i + 1, j).val : 0);                     // assume 0 if out of bounds

                strokeWeight(1);
                stroke(255);
                switch (state) {
                    case 0: /*no lines*/ break;
                    case 1: vline(c, d); break;
                    case 2: vline(b, c); break;
                    case 3: vline(b, d); break;
                    case 4: vline(a, b); break;
                    case 5: vline(a, d); vline(b, c); break;
                    case 6: vline(a, c); break;
                    case 7: vline(a, d); break;
                    case 8: vline(a, d); break;
                    case 9: vline(a, c); break;
                    case 10: vline(a, d); vline(c, b); break;
                    case 11: vline(a, b); break;
                    case 12: vline(b, d); break;
                    case 13: vline(b, c); break;
                    case 14: vline(c, d); break;
                    case 15: /*no lines*/ break;
                }
            }
        }
    }

    // getState determins which line to draw based on the surrounding "dots".
    // Note:
    // I'm not sure how javascript represents its numbers. If this operation
    // was being done on an integers, we could do this differently. For now,
    // we're just going to do a brute-force method...
    //------------------------------------------------------------------------
    getState(a, b, c, d) {
        return a * 8 + b * 4 + c * 2 + d * 1;
    }
}
