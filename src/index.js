import NeuralNetwork from './NeuralNetwork/NeuralNetwork';

const TRAINING_DATA = [
  {
    inputs: [0, 0],
    targets: [0]
  },
  {
    inputs: [0, 1],
    targets: [1]
  },
  {
    inputs: [1, 0],
    targets: [1]
  },
  {
    inputs: [1, 1],
    targets: [0]
  },

];

let nn = new NeuralNetwork(2, 3, 1);
nn.setLearningRate(0.2);

for (let i = 0; i < 10000; i++) {
  let data = TRAINING_DATA[Math.floor(Math.random() * 4)];
  nn.train(data.inputs, data.targets);
}

nn.activate([1, 0]).printInput().printOutput().printResult();
nn.activate([0, 1]).printInput().printOutput().printResult();
nn.activate([0, 0]).printInput().printOutput().printResult();
nn.activate([1, 1]).printInput().printOutput().printResult();

console.log(nn);


