export default class Sigmoid {

  static func(value) {
    return 1 / (1 + Math.exp(-value))
  }

  static derivative(value) {
    return value * (1 - value);
  }

}