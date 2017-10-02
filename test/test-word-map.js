var assert = require('assert')
var WordMap = require('../word-map.js')

describe('WordMap', function() {

    var wordMap = new WordMap()
    it('returns all inserted plays', function() {
        wordMap.insert('hi', [0,1])
        wordMap.insert('hi', [0,2])
        wordMap.insert('ho', [0,3])

        assert.equal(wordMap.plays.length, 3)
        assert.deepEqual(wordMap.plays[0], [0,1])
        assert.deepEqual(wordMap.plays[1], [0,2])
        assert.deepEqual(wordMap.plays[2], [0,3])
    })

    var wordMapCopy
    it('copies all plays properly', function() {
        wordMapCopy = wordMap.copy()

        assert.equal(wordMap.plays.length, 3)
        assert.deepEqual(wordMap.plays[0], [0,1])
        assert.deepEqual(wordMap.plays[1], [0,2])
        assert.deepEqual(wordMap.plays[2], [0,3])

        assert.equal(wordMapCopy.plays.length, 3)
        assert.deepEqual(wordMapCopy.plays[0], [0,1])
        assert.deepEqual(wordMapCopy.plays[1], [0,2])
        assert.deepEqual(wordMapCopy.plays[2], [0,3])
    })

    it('removes all variations of given word', function() {
        assert(wordMap.remove('hi') === true)
        assert.equal(wordMap.plays.length, 1)
        assert.deepEqual(wordMap.plays[0], [0,3])
    })
    
    it('removes words without affecting copied instances', function() {
        assert.equal(wordMapCopy.plays.length, 3)
        assert.deepEqual(wordMapCopy.plays[0], [0,1])
        assert.deepEqual(wordMapCopy.plays[1], [0,2])
        assert.deepEqual(wordMapCopy.plays[2], [0,3])
    })
    
    it('returns false when trying to remove nonexistent word', function() {
        assert(wordMap.remove('hi') === false)
    })
})