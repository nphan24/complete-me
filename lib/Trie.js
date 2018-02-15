import Node from './node';

export default class Trie {
  constructor() {
    this.wordCount = 0;
    this.children = {};
  }

  insert(word) {
    let splitWord = word.split('');
    let currentNode = this.children;

    while (splitWord.length) {
      let firstLetter = splitWord.shift();

      if (!currentNode[firstLetter]) {
        currentNode[firstLetter] = new Node();
      }
      if (!splitWord.length && !currentNode[firstLetter].completeWord) {
        this.wordCount++;
        currentNode[firstLetter].completeWord = true;
      }
      currentNode = currentNode[firstLetter].children;
    }
  }

  suggest(prefix) {
    const suggestions = [];
    //create an empty array that 
    let currentNode = this;
    let index = 0;

    while (index < prefix.length) {
      if (currentNode.children[prefix[index]]) {
        currentNode = currentNode.children[prefix[index]];
      }
      index++;
    }

    const addSuggestion = (node, prefix) => {

      if (node.completeWord) {
        if (node.popularity === 0) {
          suggestions.push(prefix);
        } else {
          suggestions.unshift(prefix);
        }
      }
      const childNodes = Object.keys(node.children);

      childNodes.forEach((child) => {
        const newString = prefix + child;

        addSuggestion(node.children[child], newString);
      });
    };

    addSuggestion(currentNode, prefix);
    return suggestions;
  }

  populate(words) {
    words.forEach(word => {
      this.insert(word);
    });
  }

  transverseDown(lettersArray) {
    let currentLevel = this.children;

    while (lettersArray.length > 1) {
      let currentLetter = lettersArray.shift();

      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children;
      }
    }
    return currentLevel;
  }

  select (word) {
    let lettersArray = word.split('');
    let currentLevel = this.transverseDown(lettersArray);

    currentLevel[lettersArray].popularity++;
  }

  delete (word) {
    let lettersArray = word.split('');
    let currentLevel = this.transverseDown(lettersArray);

    this.wordCount--;
    currentLevel[lettersArray].completeWord = false;
  }
}


