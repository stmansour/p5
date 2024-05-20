

function createFPT() {
    var fpt = {
        x: 0,
        y: 0,
        z: 0,
        realval: 0,
        val: 0,
        row: 0,
        col: 0,
        name: "",
    };


    return fpt;
}

function fget(i,j) {
    return field[i * cols + j];
}

function fput(i,j,fpt) {
    field[i * cols + j] = fpt;
}
