var assert = require('assert')
var WordMap = require('../word-map.js')
var State = require('../state.js')

describe('WordMap', function() {

    describe('Small tests', function() {

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

    describe('Large tests (uses State.generateWordMap() and ENABLE)', function() {

        var letterBoard = [ 'U', 'I', 'T', 'A',
                            'E', 'V', 'I', 'H',
                            'S', 'A', 'K', 'E',
                            'W', 'R', 'S', 'R' ]
        var largeWordMap = State.generateWordMap(letterBoard, 4, 4)

        it('finds all the plays', function() {
            assert.equal(largeWordMap.plays.length, 11444)
        })

        it('removes all variations of given word', function() {
            largeWordMap.remove('REVISIT')
            assert.equal(largeWordMap.plays.length, 11444 - 8)
            largeWordMap.remove('VISITER')
            assert.equal(largeWordMap.plays.length, 11444 - 8 - 8)
            largeWordMap.remove('RAISE')
            assert.equal(largeWordMap.plays.length, 11444 - 8 - 8 - 32)
        })
    })
})