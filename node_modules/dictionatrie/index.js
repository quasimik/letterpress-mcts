(function() {
  "use strict";
  
  var fs = require("fs");
  const wordListPath = require("word-list");
  
  function Node(parent, boundary) {
    this.parent = parent || null;
    this.boundary = boundary || false;
    this.children = new Map();
  }

  function Dictionary(words_param) {
    var words = words_param || fs.readFileSync(wordListPath, "utf8").split("\n");
    var self = this;
    self.rootNode = new Node();
    words.forEach(function(word) {
      self.insertWord(word, self.rootNode);
    });
  }
  
  Dictionary.prototype.insertWord = function(wordFragment, node) {
    if (wordFragment.length === 0) {
      node.boundary = true;
      return;
    }
    var nextNode = node.children.get(wordFragment[0]);
    if (nextNode === undefined) {
      var newNode = new Node(node);
      node.children.set(wordFragment[0], newNode);
      nextNode = newNode;
    }
    this.insertWord(wordFragment.slice(1), nextNode);
  }
  
  Dictionary.prototype.has = function(wordFragment, partial_param, node_param) {
    var node = node_param || this.rootNode;
    var partial = partial_param || false;
    if (wordFragment.length === 0) {
      if (partial || node.boundary) return true;
      return false;
    }
    var nextNode = node.children.get(wordFragment[0]);
    if (nextNode === undefined) return false;
    return this.has(wordFragment.slice(1), partial, nextNode);
  }
  
  module.exports = function createDictionary(words) {
    return new Dictionary(words);
  }
  
})();