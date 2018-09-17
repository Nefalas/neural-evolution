/**
 * Class Matrix
 * @property {Number} rows
 * @property {Number} cols
 * @property {Number[][]} matrix
 */
export default class Matrix {

  /**
   * Constructor for Matrix
   * @param {Number} rows
   * @param {Number} cols
   */
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.matrix = Matrix.generateMatrix(this.rows, this.cols);
  }

  /**
   * Sets the matrix
   * @param {Number[][]} matrix
   * @return {Matrix}
   */
  setMatrix(matrix) {
    if (Matrix.isMatrix(this.rows, this.cols, matrix)) {
      this.matrix = matrix;
    } else {
      throw Matrix.ERROR_ARGUMENT_BAD_FORMAT;
    }
    return this;
  }

  /**
   * Either adds a number to each value of the matrix or adds the values from
   * another matrix to this matrix
   * @param {Number|Matrix} n
   * @return {Matrix}
   */
  add(n) {
    if (typeof n === 'number') {
      this.map((val) => val + n);
    } else if (n instanceof Matrix && Matrix.isMatrix(this.rows, this.cols, n.matrix)) {
      this.map((val, rowIndex, colIndex) => val + n.matrix[rowIndex][colIndex]);
    } else {
      console.error('Add');
      console.error(this.matrix);
      console.error(n.matrix? n.matrix : n);
      throw Matrix.ERROR_ARGUMENT_BAD_FORMAT;
    }
    return this;
  }

  /**
   * Either subtracts a number from each value of the matrix or subtracts the values from
   * another matrix from this matrix
   * @param {Number|Matrix} n
   * @return {Matrix}
   */
  subtract(n) {
    if (typeof n === 'number') {
      this.map((val) => val - n);
    } else if (n instanceof Matrix && Matrix.isMatrix(this.rows, this.cols, n.matrix)) {
      this.map((val, rowIndex, colIndex) => val - n.matrix[rowIndex][colIndex]);
    } else {
      console.error('Add');
      console.error(this.matrix);
      console.error(n.matrix? n.matrix : n);
      throw Matrix.ERROR_ARGUMENT_BAD_FORMAT;
    }
    return this;
  }

  /**
   * Multiplies each value of the matrix by a number or by a value from another
   * matrix
   * @param {Number|Matrix} n
   * @return {Matrix}
   */
  multiply(n) {
    if (typeof n === 'number') {
      this.map((val) => val * n);
    } else if (n instanceof Matrix && Matrix.isMatrix(this.rows, this.cols, n.matrix)) {
      this.map((val, rowIndex, colIndex) => val * n.matrix[rowIndex][colIndex]);
    } else {
      console.error('Multiply');
      console.error(this.matrix);
      console.error(n.matrix? n.matrix : n);
      throw Matrix.ERROR_ARGUMENT_BAD_FORMAT;
    }
    return this;
  }

  /**
   * Performs the dot product of this matrix and the given one
   * @param {Matrix} matrix
   * @return {Matrix}
   */
  dot(matrix) {
    if (matrix instanceof Matrix && this.cols === matrix.rows) {
      let result = [];
      for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        let row = [];
        for (let colIndex = 0; colIndex < matrix.cols; colIndex++) {
          row.push(Matrix.vectorProduct(
            this.getRow(rowIndex), matrix.getCol(colIndex)
          ))
        }
        result.push(row);
      }
      this.matrix = result;
      this.cols = matrix.cols;
    } else {
      console.error('Dot');
      console.error(this.matrix);
      console.error(matrix.matrix);
      throw Matrix.ERROR_ARGUMENT_BAD_FORMAT;
    }
    return this;
  }

  /**
   * Sets each value of the matrix to a random value
   * @param {Number} max
   * @param {Boolean} float
   * @return {Matrix}
   */
  random(max=1, float=true) {
    if (float) {
      this.map(() => Math.random() * max);
    } else {
      this.map(() => Math.round(Math.random() * max));
    }
    return this;
  }

  transpose() {
    let result = Matrix.generateMatrix(this.cols, this.rows);
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let colIndex = 0; colIndex < this.cols; colIndex++) {
        result[colIndex][rowIndex] = this.matrix[rowIndex][colIndex];
      }
    }
    this.matrix = result;
    this.cols = this.rows;
    this.rows = result.length;
    return this;
  }

  /**
   * Applies a function to each value of the matrix
   * @param {Function} fn
   * @return {Matrix}
   */
  map(fn) {
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let colIndex = 0; colIndex < this.cols; colIndex++) {
        this.matrix[rowIndex][colIndex] = fn(
          this.matrix[rowIndex][colIndex], rowIndex, colIndex
        );
      }
    }
    return this;
  }

  /**
   * Returns a copy of this matrix
   * @return {Matrix}
   */
  clone() {
    return new Matrix(this.rows, this.cols).setMatrix(Matrix.cloneMatrix(this.matrix, this.rows, this.cols));
  }

  /**
   * Returns the matrix' row at the given index
   * @param {Number} rowIndex
   * @return {Number[]}
   */
  getRow(rowIndex) {
    return this.matrix[rowIndex];
  }

  /**
   * Returns the matrix' column at the given index
   * @param {Number} colIndex
   * @return {Array}
   */
  getCol(colIndex) {
    let col = [];
    this.matrix.map((row) => {
      col.push(row[colIndex]);
    });
    return col;
  }

  toArray() {
    let array = [];
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let colIndex = 0; colIndex < this.cols; colIndex++) {
        array.push(this.matrix[rowIndex][colIndex]);
      }
    }
    return array;
  }

  /**
   * Prints the matrix in the table format
   * @return {Matrix}
   */
  printTable() {
    console.table(this.matrix);
    return this;
  }

  /**
   * Adds two matrices or a matrix and a number ands returns the resulting matrix
   * @param {Matrix} m1
   * @param {Number|Matrix} m2
   * @return {Matrix}
   */
  static add(m1, m2) {
    return m1.clone().add(m2);
  }

  /**
   * Subtracts two matrices or a matrix and a number ands returns the resulting matrix
   * @param {Matrix} m1
   * @param {Number|Matrix} m2
   * @return {Matrix}
   */
  static subtract(m1, m2) {
    return m1.clone().subtract(m2);
  }

  /**
   * Scales two matrices or a matrix and a number ands returns the resulting matrix
   * @param {Matrix} m1
   * @param {Number|Matrix} m2
   * @return {Matrix}
   */
  static multiply(m1, m2) {
    return m1.clone().multiply(m2);
  }

  /**
   * Multiplies two matrices ands returns the resulting matrix
   * @param {Matrix} m1
   * @param {Matrix} m2
   * @return {Matrix}
   */
  static dot(m1, m2) {
    return m1.clone().dot(m2);
  }

  static fromArray(array) {
    return new Matrix(array.length, 1).setMatrix(array.map((val) => [val]));
  }

  static vectorProduct(v1, v2) {
    if (v1.length === v2.length) {
      let result = 0;
      v1.map((val, index) => {
        result += val * v2[index];
      });
      return result;
    } else {
      throw Matrix.ERROR_ARGUMENT_BAD_FORMAT;
    }
  }

  static generateMatrix(rows, cols) {
    let matrix = [];
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      let row = [];
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        row.push(0);
      }
      matrix.push(row);
    }
    return matrix;
  }

  static cloneMatrix(matrix, rows, cols) {
    let newMatrix = [];
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      let row = [];
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        row.push(matrix[rowIndex][colIndex]);
      }
      newMatrix.push(row);
    }
    return newMatrix;
  }

  static isMatrix(rows, cols, matrix) {
    if (!Array.isArray(matrix) || matrix.length !== rows) {
      return false;
    }
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      if (!Array.isArray(matrix[rowIndex]) || matrix[rowIndex].length !== cols) {
        return false;
      }
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        if (!(typeof matrix[rowIndex][colIndex] === 'number')) {
          return false
        }
      }
    }
    return true;
  }

}

Matrix.ERROR_ARGUMENT_BAD_FORMAT = Error('Argument has bad format');