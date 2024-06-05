/*jshint esversion: 6 */

let canvasWidth;
let canvasHeight;
let canvas;
let colorCheckbox;

let starters;

let queue = [];
let allCircles = [];
let epsilon = 0.1;  // tolerance for overlap and tangency

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
  canvasWidth = 800;
  canvasHeight = 600;
  canvas = createCanvas(canvasWidth, canvasHeight)
  canvas.parent('canvas-container'); // Attach the canvas to the div

  let r = height / 2;
  let h2 = height / 2;
  let w2 = width / 2;
  let r2 = r / 2;
  let r4 = r / 4;
  let rr = 124;
  let m = h2 * 7 / 8;
  let m2 = m / 2;
  let h = Math.sqrt(3) * m / 2;

  angleMode(DEGREES);
  starters = [
    // 0
    new Circle(-1 / r, w2, h2),
    new Circle(1 / (r * 3 / 4), w2, height - (r * 3 / 4)),
    new Circle(1 / (r / 4), w2, r / 4),

    // 1
    new Circle(-1 / r, w2, h2),
    new Circle(1 / r2, w2 - r2, h2),
    new Circle(1 / r2, w2 + r2, h2),

    // 2
    new Circle(1 / m2, w2, h2 - h2 / 8 - h / 2),
    new Circle(1 / m2, w2 - m / 2, h2 - h2 / 8 + h / 2),
    new Circle(1 / m2, w2 + m / 2, h2 - h2 / 8 + h / 2),
  ];

  let n = starters.length / 3;
  let s = floor(n * Math.random());
  setCirclesTo(s);

  //-------------------------------------
  // User Interface Features...
  //-------------------------------------
  createInterface();
}

function setCirclesTo(s) {
  let i = s * 3;
  let c1 = starters[i];
  let c2 = starters[i + 1];
  let c3 = starters[i + 2];

  allCircles = [c1, c2, c3];
  queue = [[c1, c2, c3]];

  if (!areTangential(c1, c2, c3)) {
    console.log("not tangential", c1, c2, c3)
  }
  loop();
}


function nextGeneration() {
  let nextQueue = [];
  for (let triplet of queue) {
    let [c1, c2, c3] = triplet;
    let k4 = descartes(c1, c2, c3);  // returns an array of 2 vals
    let newCircles = complexDescartes(c1, c2, c3, k4);  // returns an array of 4 circles

    for (let c of newCircles) {
      if (validate(c, c1, c2, c3)) {
        allCircles.push(c);
        let t1 = [c1, c2, c];
        let t2 = [c1, c3, c];
        let t3 = [c2, c3, c];
        nextQueue = nextQueue.concat([t1, t2, t3])
      }
    }
  }
  queue = nextQueue;
}

function mousePressed() {
  nextGeneration();
  draw();
}

function draw() {
  background(255);
  let len1 = allCircles.length; // Current total circles
  nextGeneration();             // Generate next generation of circles
  let len2 = allCircles.length; // New total circles

  //---------------------------------------------
  // Stop drawing when no new circles are added
  //---------------------------------------------
  if (len1 == len2) {
    noLoop();
  }

  //-----------------------
  // Display all circles
  //-----------------------
  for (let c of allCircles) {
    c.show();
  }
}

