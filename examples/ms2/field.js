class FIELD {
    constructor(r, c) {
        this.rows = r;
        this.cols = c;
        this.data = [r * c];
    }

    set(i, j, val) {
        this.data[ i * this.cols + j] = val;
    }
    get(i,j) {
        return this.data[ i*this.cols + j];
    }

}