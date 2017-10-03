'use strict'

const State = require('./state.js')
const Plays = require('./plays.js')

class Board {
    constructor(letters, numRows, numCols, startingPlayer) {
        this.letters = letters || [ ]
        this.numRows = numRows || 0
        this.numCols = numCols || 0
        this.startingPlayer = startingPlayer || 1 // 1 or -1

        this.plays = new Plays(letters)
    }

    start() {
        /* Returns a representation of the starting state of the game.
        */

        // Generate starting ownership (all 0s)
        var ownership = new Array(this.letters.length)
        ownership.fill(0)

        // Generate initial state
        // var getLegalPlayIndexes = this.plays.getLegalPlayIndexes([ ])
        var state = new State(ownership, this.startingPlayer)

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

    next_state(state, playIndex) {
        /* Takes the game state, and the move to be applied.
        ** Returns the new game state.
        */

        var play = this.plays.getPlay(playIndex)

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

        // Add played word to list of played words
        var playedWords = state.playedWords.slice()
        // console.log('play : ' + play)
        // console.log('word : ' + this.get_word(play))
        playedWords.push(play.word)

        // Flip current player
        var currentPlayer = -state.currentPlayer

        // // Remove played word from word map
        // var wordMap = state.wordMap.copy()
        // wordMap.remove(this.get_word(play))

        var newState = new State(ownership, currentPlayer, playedWords)
        return newState
    }

    legal_plays(state) {
        /* Take a state, and return a list of legal moves for current player
        */

        return this.plays.getLegalPlayIndexes(state.playedWords)
    }

    winner(state) {
        /* If game is not over, return 0.
        ** If game is over, return score.
        ** Score > 0 means player 1 won.
        ** Score < 0 means player -1 won.
        */

        if (state.ownership.some(function(owner) { return owner === 0 }))
            return 0
        var score = 0
        for (var owner of state.ownership) {
            score += owner
        }
        return score > 0 ? 1 : -1
    }
}

module.exports = Board
