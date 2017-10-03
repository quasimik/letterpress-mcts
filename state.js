'use strict'

class State {

    constructor(ownership, playedWords, currentPlayer, legalCache) {
        this.ownership = ownership
        this.playedWords = playedWords
        this.currentPlayer = currentPlayer
        this.legalCache = legalCache
    }

    get score() {
        var score = 0
        for (var value of this.ownership) {
            score+= value
        }
        return score
    }

    get legal() {
        return this.legalCache.plays
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
