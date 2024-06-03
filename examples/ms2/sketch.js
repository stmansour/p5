/*jshint esversion: 6 */

let rez = 25;
let field;
let rows, cols;
let cellWidth;
let cellHeight;
let hlf, hrez;
let mappedColorCheckbox;
let slider;
let dotSquareCheckbox;
let gridCheckbox;
let showMappedColor = false;
let canvasWidth;
let canvasHeight;
let canvas;

function setInnerHTML(id, s) {
  let el = document.getElementById(id);
  if (el != null) {
    el.innerHTML = s;
  }
}

function resetField() {
  rows = floor(canvasHeight / rez);
  cols = floor(canvasWidth / rez);
  rez2 = rez / 2;
  hlf = floor(rez2);

  field = new FIELD(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let fpt = new FPT(field);
      fpt.realval = random(1);  // a val from 0 to 1
      fpt.val = fpt.realval > 0.5 ? 1 : 0; // mapped to a binary value
      fpt.row = i;
      fpt.col = j;
      fpt.x = j * rez + rez2;  // center of cell x
      fpt.y = i * rez + rez2;  // center of cell y
      fpt.z = 0;
      fpt.name = fpt.row + ',' + fpt.col;
      field.set(i, j, fpt);
    }
  }
}

//----------------------------------------------------------------
// setup - called only once in the lifetime of the sketch
//----------------------------------------------------------------
function setup() {
  setupCalled = true;
  canvasWidth = 800;
  canvasHeight = 600;
  rows = canvasHeight / rez;
  cols = canvasWidth / rez;
  rez2 = rez / 2;
  hlf = floor(rez2);
  field = new FIELD(rows, cols);

  //-------------------------------------
  // User Interface Features...
  //-------------------------------------
  canvas = createCanvas(canvasWidth, canvasHeight)
  canvas.parent('canvas-container'); // Attach the canvas to the div
  slider = createSlider(5, 50, rez);
  slider.parent('slider-container');
  mappedColorCheckbox = createCheckbox("Mapped Color", false);
  mappedColorCheckbox.parent('mappedColorCheckbox-container');
  dotSquareCheckbox = createCheckbox("Dots", true);
  dotSquareCheckbox.parent('dotSquare-container');
  gridCheckbox = createCheckbox("Grid", true);
  gridCheckbox.parent('gridCheckbox-container');

  resetField();
}

// We need to draw lines separating the filled from the unfilled corners.
// In this diagram, the Os represent unfilled corners, and the Xs represent
// filled corners.  The lines are drawn to the center of the edge lines.
// That is, between a and b, between b and c, and so on.
//            a
//       0----+----0     0----+----0     0----+----0     0----+----0
//       |         |     |         |     |         |     |         |
//     d +    0    + b   +    1    +     +    2    +     +----3----+
//       |         |     |  \      |     |      /  |     |         |
//       0----+----0     1----+----0     0----+----1     1----+----1
//            c
//          no line         c -> d          c -> b          b -> d
//  
//            a
//       0----+----1     0----+----1     0----+----1     0----+----1
//       |      \  |     |  /      |     |    |    |     |  /      |
//     d +    4    + b   +    5    +     +    6    +     +    7    +
//       |         |     |      /  |     |    |    |     |         |
//       0----+----0     1----+----0     0----+----1     1----+----1
//            c
//          a -> b          d -> a          a -> c          d -> a
//                          c -> b
//
//            a
//       1----+----0     1----+----0     1----+----0     1----+----0
//       |  /      |     |    |    |     |  /      |     |      \  |
//     d +    8    + b   +    9    +     +   10    +     +   11    +
//       |         |     |    |    |     |      /  |     |         |
//       0----+----0     1----+----0     0----+----1     1----+----1
//            c
//          a -> d          a -> c          d -> a          a -> b
//                                          c -> b
//            a
//       1----+----1     1----+----1     1----+----1     1----+----1
//       |         |     |         |     |         |     |         |
//     d +---12----+ b   +   13    +     +   14    +     +   15    +
//       |         |     |      /  |     | \       |     |         |
//       0----+----0     1----+----0     0----+----1     1----+----1
//            c
//          d -> b          c -> b         d -> c          no line
//                          
//
// 

function draw() {
  if (slider.value() != rez) {
    rez = slider.value();
    resetField();
  }
  field.mappedColor = mappedColorCheckbox.checked();  // update to whatever the user has last selected
  background(field.bgColor);
  setInnerHTML("rows", rows);
  setInnerHTML("cols", cols);
  setInnerHTML("gridsize", rez);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let f = field.get(i, j);

      if (dotSquareCheckbox.checked()) {
        f.drawDot();
      } else {
        f.draw();
      }
      if (gridCheckbox.checked()) {
        f.drawGrid();
      }
    }
  }
  field.drawConnectors();
}

// getState determins which line to draw based on the surrounding "dots".
// Note:
// I'm not sure how javascript represents its numbers. If this operation
// was being done on an integers, we could do this differently. For now,
// we're just going to do a brute-force method...
//------------------------------------------------------------------------
// function getState(a, b, c, d) {
//   return a * 8 + b * 4 + c * 2 + d * 1;
// }

function vline(a, b) {
  line(a.x, a.y, b.x, b.y);
  line(a.x, a.y, b.x, b.y);
}


// function fget(i, j) {
//   return field[i * cols + j];
// }

// function fput(i, j, fpt) {
//   field[i * cols + j] = fpt;
// }

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