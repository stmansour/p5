let app = {
    horzCells: 70,
    vertCells: 50,
    cellw: 0,
    cellh: 0,
    grid: null,
    parent: null,
    greatgrandparent: null,
    grandparent: null,
    generations: 0,
    seed: 0,
    stable: false,
};

let genstable = ["evolving", "parent", "grandparent", "greatgrandparent"];

function setup() {
    var canvas = createCanvas(1000,650);
    canvas.parent('lifeCanvas');
    const d = new Date();
    app.seed = d.getTime();
    randomSeed(app.seed);
    setInnerHTML("seed",'' + app.seed);
    setInnerHTML("gridsize", "" + app.horzCells + " x " + app.vertCells);
}

function draw() {
    app.stable = checkStable();
    setInnerHTML("stableLabel", genstable[app.stable]);
    setInnerHTML("generations",'' + app.generations);
    if (app.stable > 0) {
        noLoop();
        enableSpecialFunction();
        return;
    }
    app.greatgrandparent = app.grandparent
    app.grandparent = app.parent;
    app.parent = app.grid;
    app.grid = nextGen();
    drawGeneration();
    app.generations += 1;
}

function drawGeneration() {
    background(0);
    app.cellw = width / app.horzCells;
    app.cellh = height / app.vertCells;

    for (var i = 0; i < app.vertCells; i++) {
      for (var j = 0; j < app.horzCells; j++) {
          strokeWeight(.25);
          stroke('black');
          rect(j*app.cellw, i*app.cellh, app.cellw, app.cellh);
          if (app.grid[i][j].alive) {
              fill('blue');
          } else {
              fill('white');
          }
          rect(j*app.cellw+1, i*app.cellh+1, app.cellw-2, app.cellh-2);
      }
    }
}

function generationStep() {
    if (app.table == 0) {
        return;
    }
    app.grid = nextGen();
    drawGeneration();
}

function newCell() {
    var cell = {
        alive: false,
    };
    return cell;
}

function enableSpecialFunction() {
    var el = document.getElementById("stepGen");
    if (el != null) {
        el.disabled = false;
    }
}

function initGrid(ar) {
    for (var i = 0; i < ar.length; i++) {
        for (var j = 0; j < ar[i].length; j++) {
            ar[i][j] = newCell();
            ar[i][j].alive = (random(101)) > 67;
        }
    }
}

function nextGenSurvives(grid,row,col) {
    let count = 0;
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (i == 0 && j == 0) {
                continue;  // ignore self
            }
            let ic = i + row;
            let jc = j + col;
            if (ic < 0 || ic >= app.vertCells || jc < 0 || jc >= app.horzCells) {
                continue;   // ignore beyond edges
            }
            if (grid[ic][jc].alive) {
                count += 1;
            }
        }
    }
    if (grid[row][col].alive) {
        return (count == 2 || count == 3);
    } else {
        return (count == 3);
    }
}

function nextGen() {
    if (app.grid == null) {
        app.grid = make2DArray(app.vertCells,app.horzCells);
        initGrid(app.grid);
        return app.grid;
    } else {
        let grid = make2DArray(app.vertCells,app.horzCells);
        initGrid(grid);
        for (var i = 0; i < app.vertCells; i++) {
            for (var j = 0; j < app.horzCells; j++) {
                grid[i][j].alive = nextGenSurvives(app.grid,i,j);
            }
        }
        return grid;
    }
}

function gridsMatch(g1,g2) {
    if (g1 == null || g2 == null) {
        return false;
    }

    for (var i = 0; i < g1.length; i++) {
        for (var j = 0; j < g1[i].length; j++) {
            if (g1[i][j].alive != g2[i][j].alive) {
                return false;
            }
        }
    }
    return true;
}

// Returns:
// 3 = stable with greatgrandparent
// 2 = stable with grandparent
// 1 = stable with parent
// 0 = no stability
//------------------------------------------------------
function checkStable() {
    if (gridsMatch(app.grid,app.parent)) {
        return 1;
    }
    if (gridsMatch(app.grid,app.grandparent)) {
        return 2;
    }
    if (gridsMatch(app.grid,app.greatgrandparent)) {
        return 3;
    }
    return 0;
}

function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}

function make2DArray(rows,cols) {
    let ar = new Array(rows); // array of rows
    for (var i = 0; i < rows; i++) {
        ar[i] = new Array(cols);
    }
    return ar;
}
