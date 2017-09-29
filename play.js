'use strict'

class Play {
    constructor(word, cells) {
        this.word = word
        this.cells = cells
    }
    get word() {
        return this.word
    }
    get cells() {
        return this.cells
    }
}

module.exports = Play
