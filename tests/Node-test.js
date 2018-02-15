import { expect } from 'chai';
import Node from '../lib/Node'

describe('NODE', () => {
  let node;

  beforeEach(() => {
    node = new Node('p')
  });

  it('should exist', () => {
    expect(node).to.exist
  });

  it('should have a defaulted complete word value of false', () => {
    expect(node.completeWord).to.equal(false)
  });

  it('should start out with an empty children object', () => {
    expect(node.children).to.deep.equal({})
  });

  it('should have a default popularity value of zero', () => {
    expect(node.popularity).to.equal(0)
  })
})