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
            assert.equal(state.legal.length, 36)
            assert.equal(state.legal.indexOf(35), 35)
            assert.equal(state.legal.indexOf(36), -1)
            assert.equal(state.hash, '0000001')
        })
    })

    describe('legalPlays()', () => {
        it('returns the right number of legal plays', () => {
            assert.equal(board.legalPlays(state).length, 36)
            assert.equal(board.legalPlays(state).indexOf(35), 35)
            assert.equal(board.legalPlays(state).indexOf(36), -1)
        })
    })

    describe('nextState()', () => {
        it('advances the state correctly', () => {
            var loPlays = board.wpm.combs[board.wpm.words.get('LO')]

            var stateLo0 = board.nextState(state, loPlays[0])
            var stateLo1 = board.nextState(state, loPlays[1])
            var stateLo2 = board.nextState(state, loPlays[2])

            assert.equal(board.legalPlays(state).length, 36)
            assert.equal(board.legalPlays(state).indexOf(35), 35)
            assert.equal(board.legalPlays(state).indexOf(36), -1)
            assert.notEqual(board.legalPlays(state).indexOf(loPlays[0]), -1)
            assert.notEqual(board.legalPlays(state).indexOf(loPlays[1]), -1)
            assert.notEqual(board.legalPlays(state).indexOf(loPlays[2]), -1)

            assert.equal(board.legalPlays(stateLo0).length, 33)
            assert.equal(board.legalPlays(stateLo0).indexOf(loPlays[0]), -1)
            assert.equal(board.legalPlays(stateLo0).indexOf(loPlays[1]), -1)
            assert.equal(board.legalPlays(stateLo0).indexOf(loPlays[2]), -1)

            assert.notEqual(stateLo0.hash, stateLo1.hash)
            assert.notEqual(stateLo0.hash, stateLo2.hash)
            assert.notEqual(stateLo1.hash, stateLo2.hash)
        })
        it('throws an error if duplicate word is played', () => {
            assert.doesNotThrow( () => {
                var validState = board.nextState(state, board.wpm.combs[board.wpm.words.get('LO')][0])
            })
            assert.throws( () => {
                var errorState = board.nextState(validState, board.wpm.combs[board.wpm.words.get('LO')][0])
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
            var stateCool2 = board2.nextState(state2, coolPlay2)
            assert.equal(board2.winner(stateCool2), 1)

            var coolPlay3 = board3.wpm.combs[board3.wpm.words.get('COOL')][0]
            var stateCool3 = board3.nextState(state3, coolPlay3)
            assert.equal(board3.winner(stateCool3), -1)
        })
    })
})