const assert = require('assert')
const Board = require('../board.js')

describe('Board', () => {

    var letters = [ 'C', 'O', 'O',
                    'O', 'L', 'C' ]
    var board = new Board(letters, 2, 3, 1)
    var state = board.start()

    describe('start()', () => {
        it('generates the correct starting state', () => {
            assert.equal(state.score, 0)
            assert.equal(state.legal.length, 33)
            assert.equal(state.legal.indexOf(32), 32)
            assert.equal(state.legal.indexOf(33), -1)
            assert.equal(state.hash, '0000001')
        })
    })

    describe('legal_plays()', () => {
        it('returns the right number of legal plays', () => {
            assert.equal(board.legal_plays(state).length, 33)
            assert.equal(board.legal_plays(state).indexOf(32), 32)
            assert.equal(board.legal_plays(state).indexOf(33), -1)
        })
    })

    describe('next_state()', () => {
        it('advances the state correctly', () => {
            var loPlays = board.wpm.combs[board.wpm.words.get('LO')]

            var stateLo0 = board.next_state(state, loPlays[0])
            var stateLo1 = board.next_state(state, loPlays[1])
            var stateLo2 = board.next_state(state, loPlays[2])

            assert.equal(board.legal_plays(state).length, 33)
            assert.equal(board.legal_plays(state).indexOf(32), 32)
            assert.equal(board.legal_plays(state).indexOf(33), -1)
            assert.notEqual(board.legal_plays(state).indexOf(loPlays[0]), -1)
            assert.notEqual(board.legal_plays(state).indexOf(loPlays[1]), -1)
            assert.notEqual(board.legal_plays(state).indexOf(loPlays[2]), -1)

            assert.equal(board.legal_plays(stateLo0).length, 30)
            assert.equal(board.legal_plays(stateLo0).indexOf(loPlays[0]), -1)
            assert.equal(board.legal_plays(stateLo0).indexOf(loPlays[1]), -1)
            assert.equal(board.legal_plays(stateLo0).indexOf(loPlays[2]), -1)

            assert.notEqual(stateLo0.hash, stateLo1.hash)
            assert.notEqual(stateLo0.hash, stateLo2.hash)
            assert.notEqual(stateLo1.hash, stateLo2.hash)
        })
        it('throws an error if duplicate word is played', () => {
            assert.doesNotThrow( () => {
                var validState = board.next_state(state, board.wpm.combs[board.wpm.words.get('LO')][0])
            })
            assert.throws( () => {
                var errorState = board.next_state(validState, board.wpm.combs[board.wpm.words.get('LO')][0])
            })
        })
    })

    var letters2 = [ 'C', 'O', 'O', 'L' ]
    var board2 = new Board(letters2, 1, 4, 1)
    var board3 = new Board(letters2, 1, 4, -1)
    var state2 = board2.start()
    var state3 = board3.start()

    describe('winner()', () => {
        it('gives the right winner', () => {
            assert.equal(board2.winner(state2), 0)
            assert.equal(board3.winner(state3), 0)
            
            var coolPlay2 = board2.wpm.combs[board2.wpm.words.get('COOL')][0]
            var stateCool2 = board2.next_state(state2, coolPlay2)
            assert.equal(board2.winner(stateCool2), 1)

            var coolPlay3 = board3.wpm.combs[board3.wpm.words.get('COOL')][0]
            var stateCool3 = board3.next_state(state3, coolPlay3)
            assert.equal(board3.winner(stateCool3), -1)
        })
    })
})