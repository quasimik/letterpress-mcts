'use strict'

// const WordMap = require('./word-map.js')

class State {

    constructor(ownership, currentPlayer, playedWords/*, map, playIndexes*/) {
        this.ownership = ownership || [ ]
        this.currentPlayer = currentPlayer || 1
        this.playedWords = playedWords || [ ]
    }

    get score() {
        var score = 0
        for (var value of this.ownership) {
            score+= value
        }
        return score
    }

    get hash() {
        // Letters are always the same
        var hash = ''
        for (var value of this.ownership) {
            hash += value
        }
        this.playedWords.sort()
        hash += this.playedWords.toString()
        hash += this.currentPlayer
        return hash
    }
}

module.exports = State
