'use strict'

/**
 * A class representing a game state.
 * A game state in Letterpress consists of:
 * 1) The ownership of the tiles
 * 2) The words that have previously been played
 * 3) The player to move next
 */
class State {
    /**
     * Create a new game state.
     * @param {number[]} ownership - The single-dimensional array representing the tile ownership state.
     * @param {string[]} playedWords - The array of played words.
     * @param {number} currentPlayer - The player next to move.
     * @param {number[]} legalPlays - The array of legal moves from this game state, as move indexes.
     */
    constructor(ownership, playedWords, currentPlayer, legalPlays) {
        this.ownership = ownership
        this.playedWords = playedWords
        this.currentPlayer = currentPlayer
        this.legalPlays = legalPlays
    }

    /**
     * Get the score of the state.
     * @return {number} The score.
     */
    get score() {
        var score = 0
        for (var value of this.ownership) {
            score+= value
        }
        return score
    }

    /** Get the array of legal moves from this state, as move indexes. */
    get legal() {
        return this.legalPlays
    }

    /**
     * Remove the given array of moves from this state's array of legal moves.
     * @param {number[]} playsToRemove - Array of moves to remove, given as move indexes. Must be given in insertion order.
     */
    removePlays(playsToRemove) {
        
        // console.log('playsToRemove : ' + this.legalPlays.length)
        // console.log('remove : ' + playsToRemove.length)

        var removeIndex = 0
        for (var i = 0; i < this.legalPlays.length && removeIndex < playsToRemove.length; i++) {
            if (this.legalPlays[i] === playsToRemove[removeIndex]) {
                this.legalPlays.splice(i, 1)
                i--
                removeIndex++
            }
        }
    }

    /**
     * Get the hash of this state.
     * The same states give the same hash and different states give different hashes.
     * @return {string} The hash.
     */
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
