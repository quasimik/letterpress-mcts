'use strict'

const State = require('./state.js')
const WordPlayMap = require('./word-play-map.js')
const LegalCache = require('./legal-cache.js')

class Board {
    constructor(letters, numRows, numCols, startingPlayer) {
        this.letters = letters || [ ]
        this.numRows = numRows || 0
        this.numCols = numCols || 0
        this.startingPlayer = startingPlayer || 1 // 1 or -1

        this.wpm = new WordPlayMap(letters)
    }

    start() {
        /* Returns the starting state.
        */

        // Generate starting ownership (all 0s)
        var ownership = new Array(this.letters.length)
        ownership.fill(0)

        // Generate initial cache of legal plays
        var legalCache = new LegalCache(this.wpm.allPlays())
        // console.log(this.wpm.allPlays())

        // Generate initial state
        var state = new State(ownership, [ ], this.startingPlayer, legalCache)

        return state
    }

    legal_plays(state) {
        /* Take a state, and return a list of legal moves for current player
        ** Returns legal moves as play indexes
        ** This is absolutely useless
        */

        return state.legalCache.plays
    }

    next_state(state, play) {
        /* Takes the game state, and the move to be applied.
        ** Returns the new game state.
        */

        var play = this.wpm.actualize(play) // Actualize play from index

        // Should not play a word played before
        if (state.playedWords.indexOf(play.word) !== -1) {
            throw new Error('Word (' + play.word + ') has been played before.')
        }

        // Update ownership
        var ownership = state.ownership.slice()
        for (var cell of play.cells) { // Slow but not used often
            // Check surrounding 4 tiles.
            // If any of the tiles are not owned by opposing player, update
            // If all 4 owned by opposing player and tile is protected, skip
            var row = Math.floor(cell / this.numCols)
            var col = cell % this.numCols

            // Up
            var rowUp = row - 1
            if (rowUp >= 0 && state.ownership[rowUp * this.numCols + col] !== -state.currentPlayer) {
                ownership[cell] = state.currentPlayer
                continue
            }

            // Down
            var rowDown = row + 1
            if (rowDown < this.numRows && state.ownership[rowDown * this.numCols + col] !== -state.currentPlayer) {
                ownership[cell] = state.currentPlayer
                continue
            }

            // Left
            var colLeft = col - 1
            if (colLeft >= 0 && state.ownership[row * this.numCols + colLeft] !== -state.currentPlayer) {
                ownership[cell] = state.currentPlayer
                continue
            }

            // Right
            var colRight = col + 1
            if (colRight < this.numCols && state.ownership[row * this.numCols + colRight] !== -state.currentPlayer) {
                ownership[cell] = state.currentPlayer
                continue
            }
        }

        // Update played words
        var playedWords = state.playedWords.slice()
        // console.log('play : ' + play)
        // console.log('word : ' + this.get_word(play))
        playedWords.push(play.word)

        // Update current player
        var currentPlayer = -state.currentPlayer

        // Update legal plays
        var legalCache = state.legalCache.copy()
        var playsToRemove = this.wpm.getPlays(play.word)
        legalCache.remove(playsToRemove)

        var newState = new State(ownership, playedWords, currentPlayer, legalCache)
        return newState
    }

    winner(state) {
        /* If game is not over, return 0.
        ** If game is over, return score.
        ** Score > 0 means player 1 won.
        ** Score < 0 means player -1 won.
        */

        var score = 0
        for (var owner of state.ownership) {
            if (owner === 0)
                return 0
            score += owner
        }
        return score > 0 ? 1 : -1
    }
}

module.exports = Board
