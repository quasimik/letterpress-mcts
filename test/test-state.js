const assert = require('assert')
const LegalCache = require('../legal-cache.js')
const State = require('../state.js')

describe('State', function() {

    var ownership = [0, 1, 1, -1, -1, -1, 0, -1]
    var plays = [0, 1, 2, 3, 4,    6, 7, 8]
    var lc = new LegalCache(plays)
    var state = new State(ownership, ['PLAYED', 'WORDS'], 1, lc)

    var ownership2 = [0, 1, 1, -1, -1, -1, 0, -1]
    var plays2 = [0, 1, 2, 3]
    var lc2 = new LegalCache(plays2)
    var state2 = new State(ownership2, ['WORDS', 'PLAYED'], 1, lc2)

    it('gives the right score', function() {
        assert.equal(state.score, -2)
    })
    it('returns all legal plays', function() {
        assert.equal(state.legal.length, 8)
        assert.equal(state.legal.indexOf(0), 0)
        assert.equal(state.legal.indexOf(4), 4)
        assert.equal(state.legal.indexOf(5), -1)
        assert.equal(state.legal.indexOf(6), 5)
        assert.equal(state.legal.indexOf(8), 7)
    })
    it('returns the right hash', function() {
        assert.equal(state.hash, '011-1-1-10-1PLAYED,WORDS1')
        assert.equal(state.hash, state2.hash)
    })
})
