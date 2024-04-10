/*jshint esversion: 6 */

let app = {
  count: 0,
  xmin: -1,
  ymin: -1,
  xmax: 1,
  ymax: 1,
  ptron: null, // A Perceptron object
};
let training = new Array(2000); // A list of points we will use to "train" the perceptron

// The function to describe a line
function f(x) {
  // y = mx + b;
  let m = 0.7
  let b = -0.5
  let y =  m*x + b;
  return y;
}
//----------------------------------------------------------------
// setup - called only once in the lifetime of the sketch
//----------------------------------------------------------------
function setup() {
    canvasWidth = 600;
    canvasHeight = 600;
    let canvas = createCanvas(canvasWidth,canvasHeight)
    canvas.parent('canvas-container'); // Attach the canvas to the div

    app.ptron = new Perceptron(3,0.005);
  
    //--------------------------------------------------------------
    // Create training information. We will train with 2000 points
    // We know the formula for the line, see f(x).
    // Since know the answer, so we can add it as well
    //--------------------------------------------------------------
    for (let i = 0; i < training.length; i++) {
      let x = random(-1, 1);
      let y = random(-1, 1);
      let answer = 1;
      if (y < f(x)) answer = -1;
      training[i] = {
        input: [x, y, 1],  // the x, the y, and the bias
        output: answer
      };
    }
  }

  // smLine - my scaled line function
  //--------------------------------------------------------------
  function smLine(x1, y1, x2, y2) {
    let lx1 = map(x1, app.xmin, app.xmax, 0, canvasWidth);
    let ly1 = map(y1, app.ymin, app.ymax, canvasHeight, 0);
    let lx2 = map(x2, app.xmin, app.xmax, 0, canvasWidth);
    let ly2 = map(y2, app.ymin, app.ymax, canvasHeight, 0);
    line(lx1, ly1, lx2, ly2);
  }

  function smGrid() {
    strokeWeight(1);
    stroke(200);
    smLine(app.xmin, 0, app.xmax, 0);
    smLine(0, app.ymin, 0, app.ymax);
  }

  function draw() {
    background(0,0,70);
    smGrid();
    //---------------------------------------------
    // Draw the "perfect" line
    //---------------------------------------------
    strokeWeight(10);
    stroke('red');
    smLine(-1, f(-1), 1, f(1));
  
    //---------------------------------------------------------
    // Draw the line based on the current weights
    // Formula is weights[0]*x + weights[1]*y + weights[2] = 0
    // y = (-weights[2] - weights[0] * x) / weights[1]
    //---------------------------------------------------------
    stroke(0,255,255);
    strokeWeight(5);
    smLine(app.xmin,app.ptron.f(app.xmin),app.xmax,app.ptron.f(app.xmax));
  
    //---------------------------------------------------------
    // Train the Perceapp.ptron with one "training" point at a time
    //---------------------------------------------------------
    app.ptron.train(training[app.count].input, training[app.count].output);
    app.count = (app.count + 1) % training.length;
  
    //-----------------------------------------------------------------
    // Draw all the points based on what the Perceptron would "guess"
    // Does not use the "known" correct answer
    //-----------------------------------------------------------------
    for (let i = 0; i < training.length; i++) {
      stroke('white');
      strokeWeight(1);
      fill('white');
      let x = map(training[i].input[0], app.xmin, app.xmax, 0, width);
      let y = map(training[i].input[1], app.ymin, app.ymax, height, 0);
      let guess = app.ptron.feedforward(training[i].input);
      if (guess == training[i].output) {
        strokeWeight(2);
        fill('white');
        if (guess == 1) {
          stroke(64,200,64);  // Above
        } else {
          stroke(100,100,255); // Below
        }
        ellipse(x, y, 8, 8);
      } else {
        strokeWeight(4);  // Incorrect classification
        fill('red');
        stroke('white')        
        ellipse(x, y, 12 , 12);
      }
      setInnerHTML("weights",app.ptron.weightsToString());
    }
  }
  
  function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}
