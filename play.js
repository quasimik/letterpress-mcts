'use strict'

/**
 * A class representing a playable move. State-agnostic.
 */
class Play {
    /**
     * Create a new play object.
     * @param {string} word - The word.
     * @param {number[]} cells - The array of cells.
     */
    constructor(word, cells) {
        this.word = word
        this.cells = cells
    }

    /** Get the hash of the play. */
    get hash() {
        return this.word + this.cells.toString()
    }
}

module.exports = Play
