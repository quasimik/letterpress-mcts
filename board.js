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
        /* Returns a representation of the starting state of the game.
        */

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
        /* Takes the game state and returns the current player.
        /*  1: Player
        /* -1: Opponent
        */

        return state.currentPlayer
    }

    next_state(state, play) {
        /* Takes the game state, and the move to be applied.
        /* Returns the new game state.
        */

        // Update ownership
        var ownership = state.ownership.slice()
        for (var cell of play[1]) {
            ownership[cell] = state.currentPlayer
        }

        // Add played word to list of played words
        var playedWords = state.playedWords.slice()
        playedWords.push(play[0])

        // Flip current player
        var currentPlayer = -state.currentPlayer

        // Remove played word from word map
        var wordMap = state.wordMap
        wordMap.remove(play[0])

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
        /* If game is over, return score.
        /* Score > 0 means player 1 won.
        /* Score < 0 means player -1 won.
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
