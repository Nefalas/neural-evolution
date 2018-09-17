import Matrix from '../Utils/Matrix';
import {
  Sigmoid
} from '../ActivationFunctions';

/**
 * Class NeuralNetwork
 * @property {Number} learningRate
 * @property {Number} inputLength
 * @property {Number} outputLength
 * @property {Number[]} hiddenLengths
 * @property {Matrix[]} weights
 * @property {Matrix[]} biases
 * @property {Function} activationFunction
 * @property {Matrix} inputs
 * @property {Matrix[]} hiddenLayers
 * @property {Matrix} outputs
 * @property {Matrix[]} errors
 */
export default class NeuralNetwork {

  constructor(...neurons) {
    this.inputLength = neurons[0];
    this.outputLength = neurons[neurons.length - 1];
    this.hiddenLengths = neurons.slice(1, neurons.length - 1);

    this.activationFunction = Sigmoid;

    this.weights = [];
    this.biases = [];
    for (let i = 0; i < neurons.length - 1; i++) {
      this.weights.push(new Matrix(neurons[i + 1], neurons[i]).random());
      this.biases.push(new Matrix(neurons[i + 1], 1).random());
    }

    this.learningRate = 0.1;
  }

  setActivationFunction(activationFunction) {
    this.activationFunction = activationFunction;
  }

  setLearningRate(learningRate) {
    this.learningRate = learningRate;
  }

  activate(inputs) {
    let hiddenLayers = [];

    let inputMatrix = Matrix.fromArray(inputs);
    this.inputs = inputMatrix;

    hiddenLayers[0] = Matrix
      .dot(this.weights[0], inputMatrix)
      .add(this.biases[0])
      .map(this.activationFunction.func);

    let index;
    for (index = 1; index < this.hiddenLengths.length; index++) {
      hiddenLayers.push(
        Matrix
          .dot(this.weights[index], hiddenLayers[index - 1])
          .add(this.biases[index])
          .map(this.activationFunction.func)
      );
    }
    this.hiddenLayers = hiddenLayers;

    this.outputs = Matrix
      .dot(this.weights[index], hiddenLayers[index - 1])
      .add(this.biases[index])
      .map(this.activationFunction.func);

    return this;
  }

  train(inputs, targets) {
    let trainedWeights = [], trainedBiases = [];
    let transposedHidden, transposedWeights, weightDeltas, gradient;

    // Activate the network in order to calculate the errors
    this.activate(inputs);

    // Generate matrix from targets array
    let targetMatrix = Matrix.fromArray(targets);

    /********************************************************
     *  Train output weights
     ********************************************************/

      // Calculate output errors by subtracting outputs to target
    let outputErrors = Matrix.subtract(targetMatrix, this.outputs);
    this.errors = [outputErrors];

    // Calculate output gradient
    gradient = this.outputs.clone()
      .map(this.activationFunction.derivative)
      .multiply(outputErrors)
      .multiply(this.learningRate);

    // Calculate output deltas
    transposedHidden = this.hiddenLayers[this.hiddenLayers.length - 1].clone().transpose();
    weightDeltas = Matrix.dot(gradient, transposedHidden);

    // Calculate trained weights
    trainedWeights.push(this.weights[this.weights.length - 1].clone().add(weightDeltas));
    // Calculate trained biases
    trainedBiases.push(this.biases[this.biases.length - 1].clone().add(gradient));

    /********************************************************
     *  Train last hidden weights
     ********************************************************/

      // Calculate last hidden error
    transposedWeights = this.weights[this.weights.length - 1].clone().transpose();
    this.errors.unshift(Matrix.dot(transposedWeights, outputErrors));

    // Calculate last hidden gradient
    gradient = this.hiddenLayers[this.hiddenLayers.length - 1].clone()
      .map(this.activationFunction.derivative)
      .multiply(this.errors[0])
      .multiply(this.learningRate);

    // Calculate last hidden deltas
    transposedHidden = (this.hiddenLayers[this.hiddenLayers.length - 2]?
      this.hiddenLayers[this.hiddenLayers.length - 2] : this.inputs).clone().transpose();
    weightDeltas = Matrix.dot(gradient, transposedHidden);

    // Calculate trained weights
    trainedWeights.unshift(this.weights[this.weights.length - 2].clone().add(weightDeltas));
    // Calculate trained biases
    trainedBiases.unshift(this.biases[this.biases.length - 2].clone().add(gradient));

    /********************************************************
     *  Train remaining hidden weights in loop
     ********************************************************/

    let index = 2;
    for (let i = this.weights.length - 3; i >= 0; i--) {
      // Calculate hidden errors
      transposedWeights = this.weights[this.weights.length - index].clone().transpose();
      this.errors.unshift(Matrix.dot(transposedWeights, this.errors[0]));

      // Calculate hidden gradient
      gradient = this.hiddenLayers[this.hiddenLayers.length - index].clone()
        .map(this.activationFunction.derivative)
        .multiply(this.errors[0])
        .multiply(this.learningRate);

      // Calculate last hidden deltas
      transposedHidden = (this.hiddenLayers[this.hiddenLayers.length - (index + 1)]?
        this.hiddenLayers[this.hiddenLayers.length - (index + 1)] : this.inputs).clone().transpose();
      weightDeltas = Matrix.dot(gradient, transposedHidden);

      // Calculate trained weights
      trainedWeights.unshift(this.weights[this.weights.length - (index + 1)].clone().add(weightDeltas));
      // Calculate trained biases
      trainedBiases.unshift(this.biases[this.biases.length - (index + 1)].clone().add(gradient));

      index++;
    }

    this.weights = trainedWeights;
    this.biases = trainedBiases;

    return this;
  }

  printInput() {
    console.log(this.inputs.toArray());
    return this;
  }

  printOutput() {
    console.log(this.outputs.toArray());
    return this;
  }

  printResult() {
    console.log(this.outputs.toArray().map(val => Math.round(val)));
    return this;
  }

}