const assert = require('assert')
const State = require('../state.js')

describe('State', function() {

    var ownership = [0, 1, 1, -1, -1, -1, 0, -1]
    var plays = [0, 1, 2, 3, 4,    6, 7, 8]
    var state = new State(ownership, ['PLAYED', 'WORDS'], 1, plays)

    var ownership2 = [0, 1, 1, -1, -1, -1, 0, -1]
    var plays2 = [0, 1, 2, 3]
    var state2 = new State(ownership2, ['WORDS', 'PLAYED'], 1, plays2)

    describe('score()', () => {
        it('gives the right score', function() {
            assert.equal(state.score, -2)
        })
    })

    describe('legal()', () => {
        it('returns all legal plays', function() {
            assert.equal(state.legal.length, 8)
            assert.equal(state.legal.indexOf(0), 0)
            assert.equal(state.legal.indexOf(4), 4)
            assert.equal(state.legal.indexOf(5), -1)
            assert.equal(state.legal.indexOf(6), 5)
            assert.equal(state.legal.indexOf(8), 7)
        })
    })

    describe('removePlays()', () => {
        it('removes plays', () => {
            assert.equal(state.legal.length, 8)
            assert.equal(state.legal.indexOf(0), 0)
            assert.equal(state.legal.indexOf(1), 1)
            state.removePlays([0])
            assert.equal(state.legal.length, 7)
            assert.equal(state.legal.indexOf(0), -1)
            assert.equal(state.legal.indexOf(1), 0)

            assert.equal(state.legal.indexOf(2), 1)
            assert.equal(state.legal.indexOf(6), 4)
            assert.equal(state.legal.indexOf(8), 6)
            state.removePlays([2, 6, 8])
            assert.equal(state.legal.length, 4)
            assert.equal(state.legal.indexOf(2), -1)
            assert.equal(state.legal.indexOf(6), -1)
            assert.equal(state.legal.indexOf(8), -1)

            assert.equal(state.legal.indexOf(1), 0)
            assert.equal(state.legal.indexOf(3), 1)
            assert.equal(state.legal.indexOf(4), 2)
            assert.equal(state.legal.indexOf(7), 3)
        })
    })

    describe('hash()', () => {
        it('returns the right hash', function() {
            assert.equal(state.hash, '011-1-1-10-1PLAYED,WORDS1')
            assert.equal(state.hash, state2.hash)
        })
    })
})
