var assert = require('assert')
var WordMap = require('../word-map.js')
var State = require('../state.js')

describe('State', function() {

    var letters = [ 'C', 'O', 'O',
                    'O', 'L', 'C' ]
    var initialWordMap = State.generateWordMap(letters, 2, 3)
    
    // for (var play of initialWordMap.plays) {
    //     var word = ''
    //     for (var cell of play) {
    //         word += letters[cell]
    //     }
    //     console.log(word + ' : ' + play)
    // }

    it('generates initial WordMap properly', function() {
        assert.equal(initialWordMap.plays.length, 33)
    })

    var nextWordMap = initialWordMap.copy()
    nextWordMap.remove('COOL') // Player 1 plays 1,2,4,5
    nextWordMap.remove('COO') // Player -1 plays 0,1,2
    var ownership = [ -1, -1, -1,
                       0,  1,  1 ]
    var state = new State(ownership, ['COOL', 'COO'], 1, nextWordMap)

    it('has sane initial values', function() {
        assert.equal(state.plays.length, 21)
        assert.equal(state.score, -1)
        assert.equal(state.hash, '-1-1-1011COO,COOL1')
    })
})
