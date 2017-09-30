'use strict'

const State = require('./state.js')
// const WordMap = require('./word-map.js')
// const GeneratePlays = require('./generate-plays.js')

class Board {
    constructor(letters, numRows, numCols, startingPlayer) {
        this.letters = letters || [ ]
        this.numRows = numRows || 0
        this.numCols = numCols || 0
        this.startingPlayer = startingPlayer || 1 // 1 or -1
    }

    start() {

        // Generate starting ownership (all 0s)
        var ownership = new Array(this.letters.length)
        ownership.fill(0)
        // console.log(ownership.toString())

        // Generate initial state
        var initialWordMap = State.generateWordMap(this.letters, this.numRows, this.numCols)
        var state = new State(ownership, [ ], this.startingPlayer, initialWordMap)

        return state
    }

    current_player(state) {
        return state.currentPlayer
    }

    next_state(state, play) {
        // Update ownership
        var ownership = state.ownership
        for (var cell of play.cells) {

        }

        // Add played word to list of played words
        var playedWords = state.playedWords

        // Flip current player
        var currentPlayer = -state.currentPlayer

        // Remove played word from word map
        var wordMap = state.wordMap

        var newState = new State(ownership, playedWords, currentPlayer, wordMap)

    }

    legal_plays(/*state_history*/ state) {
        return state.plays
    }

    winner(/*state_history*/ state) {

    }
}

module.exports = Board
