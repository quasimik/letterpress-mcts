'use strict'

class Play {
    constructor(word, cells) {
        this.word = word
        this.cells = cells
    }

    get hash() {
        return this.word + this.cells.toString()
    }
}

module.exports = Play
