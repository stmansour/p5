/*jshint esversion: 6 */

let canvasWidth;
let canvasHeight;
let canvas;

let c1, c2, c3;

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
  canvasWidth = 400;
  canvasHeight = 400;
  //-------------------------------------
  // User Interface Features...
  //-------------------------------------
  canvas = createCanvas(canvasWidth, canvasHeight)
  canvas.parent('canvas-container'); // Attach the canvas to the div

  c1 = new Circle(-1 / 200, 200, 200);
  c2 = new Circle(1 / 100, 100, 200);
  c3 = new Circle(1 / 100, 300, 200);
}

function draw() {
  background(20);

  c1.show();
  c2.show();
  c3.show();

  let k4 = descartes(c1, c2, c3);
  let locs = complexDescartes(c1, c2, c3, k4[0]);
  let d01 = new Circle(k4[0], locs[0].a, locs[0].b);
  d01.show();
  let d02 = new Circle(k4[0], locs[1].a, locs[1].b);
  d02.show();

  locs = complexDescartes(c1, c2, c3, k4[1]);
  let d11 = new Circle(k4[1], locs[0].a, locs[0].b);
  d11.show();
  let d12 = new Circle(k4[1], locs[1].a, locs[1].b);
  d12.show();
}
/**
 *  Create a descartes circle for the 3 supplied circles.
 * 
 * k4 = k1 + k2 + k3 +/- SQRT(k1*k2 + k2*k3 + k3*k1)
 * 
 * @param {*} c1 - a circle object
 * @param {*} c2 - a circle object
 * @param {*} c3 - a circle object
 * 
 * @return an array of 2 curvatures for the descartes circle
 */
function descartes(c1, c2, c3) {
  let k1 = c1.bend;
  let k2 = c2.bend;
  let k3 = c3.bend;

  let sum = k1 + k2 + k3;
  let root = 2 * Math.sqrt(k1 * k2 + k2 * k3 + k3 * k1);
  return [sum + root, sum - root];
}

/**
 * compute the x,y locations of the descartes circle given the 3 supplied circles.
 * 
 * @param {*} c1 - a circle object
 * @param {*} c2 - a circle object
 * @param {*} c3 - a circle object
 * 
 * @return four x,y locations of the descartes circle
 */
function complexDescartes(c1, c2, c3, k4) {
  let k1 = c1.bend;
  let k2 = c2.bend;
  let k3 = c3.bend;
  let z1 = c1.center;
  let z2 = c2.center;
  let z3 = c3.center;

  let zk1 = z1.scale(k1);
  let zk2 = z2.scale(k2);
  let zk3 = z3.scale(k3);

  let sum = zk1.add(zk2).add(zk3);
  let root = zk1.multiply(zk2).add(zk2.multiply(zk3)).add(zk1.multiply(zk3));
  root = root.sqrt().scale(2);

  return [sum.add(root).scale(1 / k4), sum.subtract(root).scale(1 / k4)];
}