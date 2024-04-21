/*jshint esversion: 6 */
let nn;
let resolution;
let rows;
let cols;
let ins = [];
let traincount = 0;

const train_xs = tf.tensor2d([
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1]
]);
const train_ys = tf.tensor2d([
  [0],
  [1],
  [1],
  [0]
]);

function setInnerHTML(id,s) {
  let el = document.getElementById(id);
  if (el != null) {
      el.innerHTML = s;
  }
}

//----------------------------------------------------------------
// setup - called only once in the lifetime of the sketch
//----------------------------------------------------------------
function setup() {
  canvasWidth = 600;
  canvasHeight = 600;
  let canvas = createCanvas(canvasWidth, canvasHeight)
  canvas.parent('canvas-container'); // Attach the canvas to the div

  //-------------------------------------
  // Create the neural network:
  //    2 inputs, n hidden, 1 output
  //-------------------------------------
  hiddenNodes = 5;
  nn = tf.sequential();
  let hidden = tf.layers.dense({
    inputShape: [2], // the number of inputs
    units: hiddenNodes,  // number of hidden nodes
    activation: 'sigmoid',
  });
  let o = tf.layers.dense({ // input shape is inferred
    units: 1,
    activation: 'sigmoid'
  });
  nn.add(hidden);
  nn.add(o);
  setInnerHTML('hidden', hiddenNodes);

  //----------------------------------------------------------
  // Compile the model
  // define the loss function (how well the model did)
  // and the optimizer (the algorithm to update the weights)
  //----------------------------------------------------------
  const optimizer = tf.train.sgd(0.1);
  nn.compile({
    loss: 'meanSquaredError',
    optimizer: optimizer,
  });

  //-----------------------------------------------------------------------------------
  // Here's the data we'll be feeding the model with. It's essentially the truth table
  // for XOR, but we provide fractional numbers to make it more interesting and to give 
  // it more data for visualization.
  //
  //                                  F,F       F,T
  //                                 (0,0)     (0,1)
  // Here's what we're doing           +---------+         Make the canvas turn black
  //                                   |         |         near 0,1 and make it white
  //                                   |         |         near 1,0.
  //                                   +---------+
  //                                 (1,0)     (1,1)
  //                                  T,F       T,T
  //-----------------------------------------------------------------------------------
  resolution = 50;
  rows = height / resolution;
  cols = width / resolution;

  // Create input data
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      ins.push([x1, x2]);
    }
  }
}

let isTraining = false;
let modelReady = false;

async function trainModel() {
  if (!isTraining && train_xs && train_ys) {
    isTraining = true; // Set flag to indicate training is in progress
    setInnerHTML("statespan", "Training...");
    await nn.fit(train_xs, train_ys, {
      epochs: 10,
      shuffle: true,
      // callbacks: {
      //   onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss}`)  // Log loss at the end of each epoch
      // }
    }).then(history => {
      traincount++;
      setInnerHTML("statespan", "Trained! ");
      setInnerHTML('lossspan', '' + (history.history.loss[history.history.loss.length - 1]).toFixed(7));  // Log the final loss
      setInnerHTML('traincount', '' + traincount);
      isTraining = false; // Reset flag when training is complete
      modelReady = true;  // Set the model as ready for predictions
    }).catch(err => {
      console.error('Training failed:', err);
      isTraining = false; // Reset flag if an error occurs
    });
  }
}


function draw() {
  trainModel().then(() => {
    tf.tidy(() => {
      let xs = tf.tensor2d(ins);
      let ys = nn.predict(xs).dataSync();

      // Draw output
      let idx = 0;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let f = ys[idx] * 255;
          fill(f);  // shade for the y output
          rect(i * resolution, j * resolution, resolution, resolution);
          fill(255-f);  // inverse shade for text
          textAlign(CENTER,CENTER );
          text(nf(ys[idx],1,2),i * resolution + resolution/2, j * resolution + resolution/2 )
          idx++;
        }
      }
    });
  }).catch(err => console.error(err));
}
