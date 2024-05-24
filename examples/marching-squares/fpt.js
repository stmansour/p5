

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

function fget(i, j) {
    return field[i * cols + j];
}

function fput(i, j, fpt) {
    field[i * cols + j] = fpt;
}

/**
 * getVectors - instead of choosing mid-points between the 4 dots, we move the connect
 * point based on the real color value of the dot (rather than the mapped color).
 * @param {*} i - row
 * @param {*} j - col
 * @returns 4 vectors, a,b,c,d that represent the points to which lines can be drawn
 */
function getVectors(i, j) {
    let f = fget(i, j);

    //------------------------------------------------
    // calculate a,b,c,d for this square of dots...
    //------------------------------------------------
    let a = createVector(f.x + rez2, f.y);        // between i,j and i,j+1
    let b = createVector(f.x + rez, f.y + rez2);  // between i,j+1 and i+1,j+1
    let c = createVector(f.x + rez2, f.y + rez);  // between i+1,j+1 and i,j+1
    let d = createVector(f.x, f.y + rez2);        // between i,j+1 and i,j

    return [a, b, c, d];
}