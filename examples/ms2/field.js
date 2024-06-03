class FIELD {
    constructor(r, c) {
        this.rows = r;
        this.cols = c;
        this.data = [r * c];
        this.mappedColor = false;
        this.bgColor = 127;
        this.grid = true;
    }

    set(i, j, val) {
        this.data[i * this.cols + j] = val;
    }
    get(i, j) {
        return this.data[i * this.cols + j];
    }

    draw() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let f = this.get(i, j);
                f.drawGrid();
            }
        }
    }
    drawConnectors() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let f = this.get(i, j);
                //               a                     b
                // line(this.x , this.y - rez2, this.x, this.y + rez);
                // line(this.x - rez2, this.y, this.x + rez, this.y);
                //               c                     d
                let a = createVector(f.x + rez2, f.y);        // between i,j and i,j+1
                let b = createVector(f.x + rez, f.y + rez2);  // between i,j+1 and i+1,j+1
                let c = createVector(f.x + rez2, f.y + rez);  // between i+1,j+1 and i,j+1
                let d = createVector(f.x, f.y + rez2);        // between i,j+1 and i,j

                let state = this.getState(
                    f.val,
                    (j + 1) < cols ? field.get(i, j + 1).val : 0,                       // assume 0 if out of bounds
                    (i + 1) < rows && (j + 1) < cols ? field.get(i + 1, j + 1).val : 0, // assume 0 if out of bounds
                    (i + 1) < rows ? field.get(i + 1, j).val : 0);                     // assume 0 if out of bounds

                this.drawaConnectorLine(state, a, b, c, d);
            }
        }

        //-----------------------------------------------------------------------
        // we assume that row -1 has realvals that are all 0.  First draw row -1
        //-----------------------------------------------------------------------
        let y = -rez;  // upper left corner
        for (let i = -1; i < 0; i++) {
            let x = -rez;  // upper left corner
            for (let j = -1; j < cols; j++) {
                let a = createVector(x + rez2, y);        // between i,j and i,j+1
                let b = createVector(x + rez, y + rez2);  // between i,j+1 and i+1,j+1
                let c = createVector(x + rez2, y + rez);  // between i+1,j+1 and i,j+1
                let d = createVector(x, y + rez2);        // between i,j+1 and i,j
                let state = this.getState(
                    (i < 0 || j < 0) ? 0 : field.get(i,j).val,
                    i >= 0 && (j + 1) < cols ? field.get(i, j + 1).val : 0,                 // assume 0 if out of bounds
                    (i + 1) < rows && (j + 1) < cols ? field.get(i + 1, j + 1).val : 0,     // assume 0 if out of bounds
                    (i + 1) < rows && j >= 0 ? field.get(i + 1, j).val : 0);                // assume 0 if out of bounds

                this.drawaConnectorLine(state, a, b, c, d);
                x += rez;
            }
            y += rez;
        }

    }

    getState(a, b, c, d) {
        return a * 8 + b * 4 + c * 2 + d * 1;
    }


    drawaConnectorLine(state, a, b, c, d) {
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