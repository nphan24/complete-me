export default class Node {
  constructor (letter = null) {
    this.letter = letter;
    this.completedWord = false;
    this.children = {};
    this.popularity = 0;
  }
}