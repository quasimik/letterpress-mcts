'use strict'

const State = require('./state.js')

class Board {
    constructor(letters, numRows, numCols, startingPlayer) {
        this.letters = letters || [ ]
        this.numRows = numRows || 0
        this.numCols = numCols || 0
        this.startingPlayer = startingPlayer || 1 // 1 or -1
    }

    start() {
        /* Returns a representation of the starting state of the game.
        */

        // Generate starting ownership (all 0s)
        var ownership = new Array(this.letters.length)
        ownership.fill(0)
        // ownership[0] = -1
        // ownership[1] = -1
        // ownership[4] = -1
        // console.log(ownership.toString())

        // Generate initial state
        var initialWordMap = State.generateWordMap(this.letters, this.numRows, this.numCols)
        var state = new State(ownership, [ ], this.startingPlayer, initialWordMap)

        return state
    }

    current_player(state) {
        /* Takes the game state and returns the current player.
        **  1: Player
        ** -1: Opponent
        */

        return state.currentPlayer
    }

    get_word(cells) {
        var word = ''
        for (var cell of cells) {
            word += this.letters[cell]
        }
        return word
    }

    next_state(state, play) {
        /* Takes the game state, and the move to be applied.
        ** Returns the new game state.
        */

        // Update ownership
        var ownership = state.ownership.slice()
        for (var cell of play) {
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

        // Add played word to list of played words
        var playedWords = state.playedWords.slice()
        playedWords.push(this.get_word(play))

        // Flip current player
        var currentPlayer = -state.currentPlayer

        // Remove played word from word map
        var wordMap = state.wordMap.copy()
        wordMap.remove(this.get_word(play))

        var newState = new State(ownership, playedWords, currentPlayer, wordMap)
        return newState
    }

    legal_plays(/*state_history*/ state) {
        /* Take a state, and return a list of legal moves for current player
        */

        return state.plays
    }

    winner(/*state_history*/ state) {
        /* If game is not over, return 0.
        ** If game is over, return score.
        ** Score > 0 means player 1 won.
        ** Score < 0 means player -1 won.
        */

        if (state.ownership.some(function(e) { return e === 0 }))
            return 0
        var score = 0
        for (var owner of state.ownership) {
            score += owner
        }
        return owner
    }
}

module.exports = Board
