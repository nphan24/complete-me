import { expect } from 'chai';
import Node from '../lib/Node';
import Trie from '../lib/Trie';
import fs from 'fs';

const text = "/usr/share/dict/words";
const dictionary = fs.readFileSync(text).toString().trim().split('\n');

describe('TRIE', () => {
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('should exist', () => {
    expect(trie).to.exist;
  });

  it('should start with zero elements', () => {
    expect(trie.wordCount).to.equal(0);
  });

  it('should track the number of words', () => {
    expect(trie.wordCount).to.equal(0);
    trie.insert('hello');
    expect(trie.wordCount).to.equal(1);
  });

  it('should be able to store nodes', () => {
    expect(trie.children).to.deep.equal({})
  })

  describe('INSERT', () => {

    it('should be able to increment count', () => {
      expect(trie.wordCount).to.equal(0)
      trie.insert('pizza');
      expect(trie.wordCount).to.equal(1)
    });

    it('should create keys in children object of the first letter', () => {

      trie.insert('tacocat');
      trie.insert('pizza');
      trie.insert('cat');

      expect(Object.keys(trie.children)).to.deep.equal(['t','p','c'])
    });
  
    it('should be able to take in more than one word starting with the same letter', () => {

      trie.insert('dog');
      trie.insert('cat');
      trie.insert('piano');
      trie.insert('dog');
      trie.insert('catalog');

      expect(Object.keys(trie.children)).to.deep.equal(['d','c','p']);
      expect(trie.wordCount).to.equal(4)
    });

    it('should not increase the wordCount if the word is inserted twice', () => {
      trie.insert('cat');
      trie.insert('can');
      trie.insert('cattle');
      trie.insert('can');

      expect(trie.wordCount).to.deep.equal(3);

    });

    it('should only add one childe node of each letter', () => {
      trie.insert('pizza');
      trie.insert('piano');

      let childNodes = Object.keys(trie.children);

      expect(childNodes.length).to.equal(1);
    })


    it('should only create one node when two words with same prefix are added', () => {
      trie.insert("pizza");
      trie.insert("piano");

      var childNodes1 = Object.keys(trie.children);

      expect(childNodes1.length).to.equal(1);
      expect(childNodes1).to.deep.equal(['p']);

      let trie2 = new Trie();

      trie2.insert("lamb");
      trie2.insert("lady");

      var childNodes2 = Object.keys(trie2.children);

      expect(childNodes2.length).to.equal(1);
      expect(childNodes2).to.deep.equal(['l']);
    }) 
  })

  describe('SUGGEST', () => {

    beforeEach(() => {
      trie.insert('piano');
      trie.insert('pizza');
      trie.insert('pizzas');
      trie.insert('dog')
    });

  it('should have a method suggest', () => {
    expect(trie.suggest('dog')).to.be.a.function
  });

  it('should return an array of suggested words', () => {

    let results = trie.suggest('pi');
    let check1 = results.some(result => result === 'pizza');
    let check2 = results.some(result => result === 'pizzas');
    let check3 = results.some(result => result === 'piano');
    let check4 = results.some(result => result === 'dog');

    expect(check1).to.be.true;
    expect(check2).to.be.true;
    expect(check3).to.be.true;
    expect(check4).to.be.false;
    });
  })

  describe('POPULATE', () => {

    it('should populate the dictionary', () => {
      trie.populate(dictionary);
      expect(trie.wordCount).to.equal(235886)
    });
  })

  describe('SELECT', () => {
    
    it('should start with a popularity of zero', () => {
      trie.insert('cat');
      expect(trie.children['c'].children['a'].children['t'].popularity).to.equal(0)
    });

    it('should prioritize ', () => {
      trie.populate(dictionary);
      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);
      trie.select('pizzeria');
      expect(trie.suggest('piz')).to.deep.equal([ 'pizzeria', 'pize', 'pizza', 'pizzicato', 'pizzle' ]);
    });
  })
  
  describe('DELETE', () => {
    
    it('should delete the word ', () => {
      trie.populate(dictionary);
      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);
      
      trie.delete('pizzeria');
      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzicato', 'pizzle' ]);
    });

    it('should not return deleted words', () => {
      trie.insert('monkey');
      trie.insert('money');
      trie.insert('many');
      trie.insert('multiple');

      let actual = trie.suggest('mon');
      let expected = ['monkey', 'money'];

      expect(actual).to.deep.equal(expected);

      trie.delete('money');
      actual = trie.suggest('mon');
      expected = ['monkey'];
      expect(actual).to.deep.equal(expected);
    });
  });
})






