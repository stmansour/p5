/*jshint esversion: 6 */

let rez = 10;
let field;
let rows, cols;
let hlf, hrez;
let checkbox;
let slider;
let dotSquareCheckbox;
let setupCalled = false;
let canvasWidth;
let canvasHeight;
let canvas;

function setInnerHTML(id, s) {
  let el = document.getElementById(id);
  if (el != null) {
    el.innerHTML = s;
  }
}

//----------------------------------------------------------------
// setup - called only once in the lifetime of the sketch
//----------------------------------------------------------------
function setup() {

  if (!setupCalled) {
    setupCalled = true;
    canvasWidth = 800;
    canvasHeight = 600;
    canvas = createCanvas(canvasWidth, canvasHeight)
    canvas.parent('canvas-container'); // Attach the canvas to the div
    slider = createSlider(5, 40, rez);
    slider.parent('slider-container');
    checkbox = createCheckbox("Mapped Color", true);
    checkbox.parent('checkbox-container');
    dotSquareCheckbox = createCheckbox("Dots", true);
    dotSquareCheckbox.parent('dotSquare-container');
  }

  rows = 1 + floor(canvasHeight / rez);
  cols = 1 + floor(canvasWidth / rez);
  rez2 = rez / 2;
  hlf = floor(rez2);
  field = [rows * cols];


  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let fpt = createFPT();
      fpt.realval = random(1);  // a val from 0 to 1
      fpt.val = fpt.realval > 0.5 ? 1 : 0; // mapped to a binary value
      fpt.row = i;
      fpt.col = j;
      fpt.x = j * rez + rez2;
      fpt.y = i * rez + rez2;
      fpt.z = 0;
      fpt.name = fpt.row + ',' + fpt.col;
      fput(i, j, fpt);
    }
  }
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
    setup();
  }
  background(127);
  setInnerHTML("rows", rows);
  setInnerHTML("cols", cols);
  setInnerHTML("gridsize", rez);



  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < cols - 1; j++) {
      let f = field[i * cols + j];

      // Set the color to the field value
      let v = f.realval;
      let urv = checkbox.checked();  // use real value or mapped value

      if (!urv) {
        v = f.val;
      }
      stroke(v * 255);
      if (dotSquareCheckbox.checked()) {
        strokeWeight(rez * 0.4);
        point(f.x, f.y);
      } else {
        strokeWeight(0);
        fill(v * 255);
        rect(f.x - rez2 / 2, f.y - rez2 / 2, rez2 + rez2 / 2, rez2 + rez2 / 2);
      }

      let vec = getVectors(i,j);
      let a = vec[0];
      let b = vec[1];
      let c = vec[2];
      let d = vec[3];

      // let state = getState(field.get([i,j].val, field.get(i,j+1).val, field[(i + 1) * cols + j].val, field[(i + 1) * cols + j + 1].val);
      let state = getState(
        fget(i, j).val,
        fget(i, j + 1).val,
        fget(i + 1, j + 1).val,
        fget(i + 1, j).val);


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

function cp(i, j) {
  console.log(field[i * cols + j].val + "   " + field[i * cols + j + 1].val);
  console.log(field[(i + 1) * cols + j].val + "   " + field[(i + 1) * cols + j + 1].val);
}

// getState determins which line to draw based on the surrounding "dots".
// Note:
// I'm not sure how javascript represents its numbers. If this operation
// was being done on an integers, we could do this differently. For now,
// we're just going to do a brute-force method...
//------------------------------------------------------------------------
function getState(a, b, c, d) {
  return a * 8 + b * 4 + c * 2 + d * 1;
}

function vline(a, b) {
  line(a.x, a.y, b.x, b.y);
  line(a.x, a.y, b.x, b.y);
}
