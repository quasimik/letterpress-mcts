'use strict'

const State = require('./state.js')
const WordPlayMap = require('./word-play-map.js')

/**
 * Class representing the Letterpress game board.
 * Encapsulates the rules of Letterpress.
 * Takes care of generating, storing, and returning legal moves for each given game state.
 * Takes care of advancing a state given a legal move from that game state.
 */
class Board {
    /**
     * Create a new Letterpress board.
     * Create a WordPlayMap, which generates all playable moves and stores them.
     * @param {string[]} letters - The single-dimensional array of letters representing the letters on the Letterpress board.
     * @param {number} numRows - The number of rows of the board.
     * @param {number} numCols - The number of columns of the board.
     * @param {number} startingPlayer - The starting player of the game. Can be either 1 or -1.
     */
    constructor(letters, numRows, numCols, startingPlayer) {
        this.letters = letters || [ ]
        this.numRows = numRows || 0
        this.numCols = numCols || 0
        this.startingPlayer = startingPlayer || 1 // 1 or -1

        this.wpm = new WordPlayMap(letters)
    }

    /**
     * Generate and return the initial game state based on the initial properties of the board.
     * @return {State} The initial game state.
     */
    start() {

        // Generate starting ownership (all 0s)
        var ownership = new Array(this.letters.length)
        ownership.fill(0)

        // Generate initial state
        var state = new State(ownership, [ ], this.startingPlayer, this.wpm.allPlays())

        return state
    }

    /**
     * Return the current player's legal moves from the given game state.
     * @param {State} state - The state to find the legal moves of.
     * @return {number[]} - The array of move indexes corresponding to the legal moves playable from this game state.
     */
    legalPlays(state) {
        return state.legalPlays
    }

    /**
     * Apply the given move to the given game state.
     * Return the new game state.
     * @param {State} state - The old game state.
     * @param {number} play - The move index to be applied.
     * @return {State} The new game state.
     */
    nextState(state, play) {

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
        playedWords.push(play.word)

        // Update current player
        var currentPlayer = -state.currentPlayer

        // Copy legal plays
        var legalPlays = state.legalPlays.slice()

        // Create new state
        var newState = new State(ownership, playedWords, currentPlayer, legalPlays)

        // Update legal plays
        var playsToRemove = this.wpm.getPrefixes(play.word)
        newState.removePlays(playsToRemove)

        return newState
    }

    /**
     * Get the winner of the game.
     * If the game is over, return the winner (1 or -1).
     * If the game is not over, return 0.
     * @param {State} state - The game state to find the winner of.
     * @return {number} The winner: either 1, -1, or 0.
     */
    winner(state) {

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
