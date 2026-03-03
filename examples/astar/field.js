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

}