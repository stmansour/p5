let app = {
    horzCells: 70,
    vertCells: 50,
    cellw: 0,
    cellh: 0,
    grid: null,
    ancestors: [],     // previous generations
    ancestorDepth: 15,  // how many previdous generations to store
    generations: 0,
    seed: 0,
    stable: 0,
};
function setup() {
    var canvas = createCanvas(700,500);
    canvas.parent('lifeCanvas');
    initLife();
}

function draw() {
    app.stable = checkStable();
    setInnerHTML("stableLabel", getStableGenString(app.stable));
    setInnerHTML("generations",'' + app.generations);
    if (app.stable > 0) {
        noLoop();
        turnOffSpecialFunctions(false);
        disableStopContinue(true);
        return;
    }
    shiftGenerations();
    app.grid = nextGen();
    drawGeneration();
    app.generations += 1;
}

function newGame() {
    initLife();
    turnOffSpecialFunctions(true);
    disableStopContinue(false);
    app.screen.clearAds();
    loop();
}

function initLife() {
    app.ancestors = [];
    for (var i = 0; i < app.ancestorDepth; i++) {
        app.ancestors.push(null);
    }
    app.grid = null,
    app.generations = 0

    // check for seed...
    app.seed = getSeed();
    if (app.seed == 0) {
        const d = new Date();
        app.seed = d.getTime();
    }
    randomSeed(app.seed);
    setInnerHTML("seed",'' + app.seed);
    setInnerHTML("gridsize", "" + app.horzCells + " x " + app.vertCells);

}

function getSeed() {
    var el = document.getElementById('randomSeed');
    if (el == null) {
        return 0;
    }
    if (el.value == "") {
        return 0;
    }

    var x = parseInt(el.value, 10);
    return x;
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

function shiftGenerations() {
    for (var i = app.ancestorDepth - 2; i >= 0; i--) {
        app.ancestors[i+1] = app.ancestors[i];
    }
    app.ancestors[0] = app.grid;
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

function disableElement(id,x) {
    var el = document.getElementById(id);
    if (el != null) {
        el.disabled = x;
    }
}

function disableElements(buttons,x) {
    for (var i = 0; i < buttons.length; i++) {
        disableElement(buttons[i],x);
    }
}
function turnOffSpecialFunctions(x) {
    disableElements(["stepGen", "newGame"], x);
}

function disableStopContinue(x) {
    disableElements(["stopSim", "contSim"], x);
}

function stopSim() {
    noLoop();
}

function contSim() {
    loop();
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
    for (var i = 0; i < app.ancestors.length; i++) {
        if (gridsMatch(app.grid,app.ancestors[i])) {
            return i+1;
        }
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

function getStableGenString(n) {
    if (n == 0) {
        return "evolving";
    }
    return "stabilizes over " + n + " generations starting with gen " + (app.generations-n);

}
