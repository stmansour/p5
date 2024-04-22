import { TRAINING_DATA } from './mnist.js';

let noderadius = 8;
let nodespacing = 4;
let neuralNetwork = {
    layers: [
        {
            id: "input",
            nodeCount: 720,
            nodesToShow: 20, // Only show 20 for simplicity, with ellipsis for more
            radius: noderadius,
            spacing: nodespacing,
            activations: new Array(20).fill(0), // Store last activation levels for visualization
            color: "#3498db",
            pos: [] // x,y locations of each node
        },
        {
            id: "hidden1",
            nodeCount: 32,
            nodesToShow: 32,
            radius: noderadius,
            spacing: nodespacing,
            color: "#2ecc71",
            activations: new Array(32).fill(0),
            pos: [] // x,y locations of each node
        },
        {
            id: "hidden2",
            nodeCount: 16,
            nodesToShow: 16,
            radius: noderadius,
            spacing: nodespacing,
            color: "#f1c40f",
            activations: new Array(16).fill(0),
            pos: [] // x,y locations of each node
        },
        {
            id: "output",
            nodeCount: 10,
            nodesToShow: 10,
            radius: noderadius,
            spacing: nodespacing,
            color: "#e74c3c",
            activations: new Array(10).fill(0),
            pos: [] // x,y locations of each node
        },
    ],
    horizontalSpacing: 200,
    weights: [] // Optional, if you plan to visualize weights as well
};

const INPUTS = TRAINING_DATA.inputs;
const OUTPUTS = TRAINING_DATA.outputs;
tf.util.shuffleCombo(INPUTS, OUTPUTS); // shuffle the two arrays in the same way (inputs will still match outputs)

const INPUTS_TENSOR = tf.tensor2d(INPUTS); // make input a 2d tensor
const OUTPUTS_TENSOR = tf.oneHot(tf.tensor1d(OUTPUTS, 'int32'), 10 /*posible classes*/); // make output a 1d tensor
const model = tf.sequential();

model.add(tf.layers.dense({ inputShape: [784], units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: 16, activation: 'relu' }));      // we'll give it 16 internal nodes
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));  // we want 10 nodes on the output, one for each digit
model.summary();
train();

function initializeApp() {
    // Setup canvas, network visualization, etc.
    const canvas = document.getElementById('neuralNetworkCanvas');
    canvas.width = 800;
    canvas.height = 650;
    const ctx = canvas.getContext('2d');

    // Initialize weights for each layer connection, ensure all layers have properly defined weights
    neuralNetwork.layers.forEach((layer, index) => {
        if (index < neuralNetwork.layers.length - 1) {
            let nextLayer = neuralNetwork.layers[index + 1];
            neuralNetwork.weights[index] = new Array(layer.nodeCount);
            for (let i = 0; i < layer.nodeCount; i++) {
                neuralNetwork.weights[index][i] = new Array(nextLayer.nodeCount);
                for (let j = 0; j < nextLayer.nodeCount; j++) {
                    neuralNetwork.weights[index][i][j] = Math.random() * 2 - 1; // Assign a random weight for demonstration
                }
            }
        }
    });

    drawNetwork(ctx, neuralNetwork);  // Your function to draw the network
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOMContentLoaded has already fired
    initializeApp();
}

async function train() {
    // Compile the model with the defined optimizer and loss function
    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    })

    let results = await model.fit(INPUTS_TENSOR, OUTPUTS_TENSOR, {
        shuffle: true,
        validationSplit: 0.2,   // leave 20% for validation
        batchSize: 512,         // Update weights after every 512 examples
        epochs: 50,             // Go over the data 50 times
        callbacks: {
            onEpochEnd: logProgress
        }
    });

    OUTPUTS_TENSOR.dispose();
    INPUTS_TENSOR.dispose();
    evaluate();  // it has been trained, now we can evaluate the model
}

function logProgress(epoch, logs) {
    // console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss}, Accuracy = ${logs.acc}`);
    setInnerHTML("epochs", epoch + 1);
    setInnerHTML("lossspan", '' + (logs.loss).toFixed(7));
    setInnerHTML("traincount", '' + (epoch + 1));
}


const PREDICTION_ELEMENT = document.getElementById('prediction');

function evaluate() {
    const OFFSET = Math.floor(INPUTS.length * Math.random());

    let answer = tf.tidy(function () {
        let newInput = tf.tensor1d(INPUTS[OFFSET]);

        // Expand dimensions to make it a 2D tensor [1, 784] if needed by the model
        newInput = newInput.expandDims(0);  // Adds a new dimension at the beginning

        console.log("Input to model:", newInput);
        console.log("Shape of newInput:", newInput.shape);
        newInput.print();
        let output = model.predict(newInput);
        output.print();
        return output.squeeze().argMax();
    });

    answer.array().then(function (index) {
        PREDICTION_ELEMENT.innerText = index;
        PREDICTION_ELEMENT.setAttribute('class', (index == OUTPUTS[OFFSET]) ? 'correct' : 'wrong');
        answer.dispose();
        drawImage(INPUTS[OFFSET]);
    })
    // let output = model.predict()
}

const CANVAS = document.getElementById('tfcanvas');
const CTX = CANVAS.getContext('2d');

function drawImage(image) {
    var imageData = CTX.createImageData(28, 28);
    for (let i = 0; i < image.length; i++) {
        imageData.data[i * 4] = image[i] * 255;   // red
        imageData.data[i * 4 + 1] = image[i] * 255; // green
        imageData.data[i * 4 + 2] = image[i] * 255; // blue
        imageData.data[i * 4 + 3] = 255;            // alpha
    }

    CTX.putImageData(imageData, 0, 0); // render the updated array
    setTimeout(evaluate, 2000)
}

function setInnerHTML(id, s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}

