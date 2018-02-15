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
    //create an empty array that will return the suggestions
    let currentNode = this;
    //currentNode starts out as an empty tree
    let index = 0;
    //the first time around, the index starts at zero

    while (index < prefix.length) {
      if (currentNode.children[prefix[index]]) {
        currentNode = currentNode.children[prefix[index]];
      }//checking to see if the trie has a node with the first letter passed in
      //if it does, then set the currentNode equal to that node
      index++;
    }//increase the index and goes back through the while loop until the index is
    //greater than the prefix's length

    const addSuggestion = (node, prefix) => {
      //if the node's property of complete is true
      if (node.completeWord) {
        if (node.popularity === 0) {//AND the popularity property is zero
          suggestions.push(prefix); //put the word into the back of the array
        } else {
          suggestions.unshift(prefix);//otherwise it puts the word into the front 
        }
      }
      const childNodes = Object.keys(node.children);
      //grab all the keys of the current node
      childNodes.forEach((child) => {
        const newString = prefix + child;
        //for each child of the current node, add the child letter onto the prefix
        addSuggestion(node.children[child], newString);
      });//continue doing so until the word is complete
    };

    addSuggestion(currentNode, prefix);
    return suggestions;//return the suggestions array with the suggestions in it
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


