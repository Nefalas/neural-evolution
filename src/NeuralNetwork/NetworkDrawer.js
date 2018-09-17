import NeuralNetwork from './NeuralNetwork';

/**
 * Class NetworkDrawer
 * @property {NeuralNetwork} neuralNetwork
 */
export default class NetworkDrawer {

  /**
   * Constructor for NetworkDrawer
   * @param {NeuralNetwork} neuralNetwork
   */
  constructor(neuralNetwork, canvas) {
    this.neuralNetwork = neuralNetwork;
  }

}