'use strict'

const State = require('./state.js')
// const WordMap = require('./word-map.js')
// const GeneratePlays = require('./generate-plays.js')

class Board {
    constructor(letters, startingPlayer) {
        this.letters = letters || [ ]
        this.startingPlayer = startingPlayer || 1 // 1 or -1
    }

    start() {

        // Generate starting ownership (all 0s)
        var numRows = this.letters.length
        var numCols = this.letters[0].length
        var ownership = new Array(numRows)
        for (var row = 0; row < numRows; row++) {
            ownership[row] = new Array(numCols)
            for (var col = 0; col < numCols; col++) {
                ownership[row][col] = 0
            }
        }
        console.log(ownership.toString())

        // Generate initial state
        var state = new State(ownership, [ ], this.startingPlayer, State.generateWordMap(this.letters))

        return state
    }

    current_player(state) {

    }

    next_state(state, play) {

    }

    legal_plays(/*state_history*/ state) {
        return state.plays
    }

    winner(/*state_history*/ state) {

    }
}

module.exports = Board
