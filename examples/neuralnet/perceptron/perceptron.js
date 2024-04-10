// Perceptron is created with n weights and
// a learning factor, learningFactor.  It is used to classify
// its inputs. Assuming the simplest division of the inputs is
// a line, we want to supply points, and the perceptron will
// tell us whether the point is classified above or below the
// line. 
//
// INPUTS
//    n - size of the array that will hold 3 values currently:
//        x*weight_x, y*weight_y, bias * weight_bias. And the
//        assumption is that that this describes a line. 
//        A line is described will be:
//            y = (-weights[2] - weights[0] * x) / weights[1]
//    c - learning factor - the larger this value is, the
//        faster the perceptron learns. However, it's not very
//        granular. As the error gets smaller, the learning
//        factor should get smaller so that the rise and run
//        will become more precise.
//------------------------------------------------------------
class Perceptron {
  constructor(n, c) {
    this.weights = new Array(n);
    this.learningFactor = c;

    //--------------------------------------
    // initialize weights to random values
    //--------------------------------------
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = Math.random() * 2 - 1;
    }
  }

  //----------------------------------------------------------------
  // Function to train the Perceptron
  // Weights are adjusted based on "desired" answer
  // Here is the training algorithm
  //    1. Provide the perceptron with inputs for which there is a known answer
  //    2. Ask the perceptron to guess the result
  //    3. Was it right or wrong? If wrong, compute the error
  //    4. Adjust the weights based on the error
  //    5. repeat at step 1 until the error is 0
  //----------------------------------------------------------------
  train(inputs, desired) {
    //-----------------------------
    // Guess the result
    //-----------------------------
    let guess = this.feedforward(inputs);
  
    //---------------------------------------------------------------
    // Compute the factor for changing the weight based on the error
    // Error = desired output - guessed output
    // Note this can only be 0, -2, or 2
    // Multiply by learning factor
    //---------------------------------------------------------------
    let error = desired - guess;
    
    //---------------------------------------------------------------
    // Adjust weights based on weightChange * input
    //---------------------------------------------------------------
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += this.learningFactor * error * inputs[i];
    }
  }

  // guess is a method that makes a guess at the output
  // we can pass in a list of inputs  
  guess(inputs) {
    let sum = 0;
    for (let i = 0; i < 2; i++) {
      sum += this.weights[i] * inputs[i]; // the weighted sum
    }

    // this is the activation function
    if (sum >= 0) {
      return 1;
    } else {
      return -1;
    }
  }

  // Guess -1 or 1 based on input values
  feedforward(inputs) {
    // Sum all values
    let sum = 0;
    for (let i = 0; i < this.weights.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    // Result is sign of the sum, -1 or 1
    return this.activate(sum);
  }

  activate(sum) {
    if (sum > 0) return 1;
    else return -1;
  }

  // Return weights
  getWeights() {
    return this.weights;
  }

  // f(x) to get the y value.
  // y = weights_y/weights_x * x + weights_bias
  // 

  // y = (-weights[2] - weights[0] * xmin) / weights[1];
  //--------------------------------------------------------------
  f(x) {
    return (-this.weights[2] - this.weights[0] * x)/ this.weights[1];
  }

  weightsToString() { 
    let str = "";
    for (let i = 0; i < this.weights.length; i++) {
      str += "w" + i + " = " + this.weights[i].toFixed(4) + "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    return str;
  }
}