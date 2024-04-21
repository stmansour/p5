import { TRAINING_DATA } from './mnist.js';

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
    console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss}, Accuracy = ${logs.acc}`);
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
    let output = model.predict()
}

const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');

function drawImage(image) {
    var imageData = CTX.createImageData(28, 28);
    for (let i = 0; i < image.length; i++) {
        imageData.data[i*4] = image[i] * 255;   // red
        imageData.data[i*4+1] = image[i] * 255; // green
        imageData.data[i*4+2] = image[i] * 255; // blue
        imageData.data[i*4+3] = 255;            // alpha
    }

    CTX.putImageData(imageData, 0, 0); // render the updated array
    setTimeout(evaluate,2000)
}
