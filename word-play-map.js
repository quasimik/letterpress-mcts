'use strict'

const os = require('os')
const Play = require('./play.js')
const Dictionary = require('dictionatrie')
const fs = require('fs')
const words = fs.readFileSync('./word-lists/letterpress.txt', 'utf8').split(os.EOL)
const dictionary = new Dictionary(words)

/**
 * Class responsible for generating, storing, indexing, and restoring all legal moves in the given array of letters.
 * This class is dimension-agnostic, so it does not accept any board dimension parameters.
 */
class WordPlayMap {
    /**
     * Create a new WordPlayMap.
     * @param {string[]} letters - The single-dimensional array of letters to find all the moves for.
     */
    constructor(letters) {

        console.log('generating plays...')
        var start = Date.now()
        var gen = WordPlayMap.genPlays(letters)
        var duration = ((Date.now() - start) / 1000).toFixed(1)
        console.log('generated ' + gen.plays.length + ' plays using ' + 
                                   gen.combs.length + ' words in ' + 
                                   duration + ' seconds')

        this.words = gen.words // Map: word => wordI // Optimization: Maybe use plain array?
        this.combs = gen.combs // [[playI, playI, ...], [playI, playI, ...], ...]
        this.plays = gen.plays // [Play, Play, ...]
    }

    /**
     * Generate all the moves possible in the given array of letters.
     * Map all playable words to their combinations of moves.
     * @param {string[]} letters - The single-dimensional array of letters to find all the moves for.
     * @return {Object} The object containing a mapping of playable words to their combinations of moves.
     */
    static genPlays(letters) {

        var words = new Map()
        var combs = [ ]
        var plays = [ ]

        var wordI = 0
        var playI = 0

        var availableTiles = [ ]
        for (var i = 0; i < letters.length; i++)
            availableTiles.push(i)

        genPlaysHelper(availableTiles, [ ], '');

        function genPlaysHelper(availableTiles, cellsFragment, wordFragment) {
            if (availableTiles.length === 0)
                return

            for (var i = 0; i < availableTiles.length; i++) {
                
                var newLetter = letters[availableTiles[i]]

                // Check if this new word fragment is a prefix of any real word
                var newWordFragment = wordFragment + newLetter
                // console.log('at : ' + newWordFragment + ' (' + availableTiles[i] + ')')
                if (!dictionary.has(newWordFragment.toLowerCase(), true)) // partial (prefix) match
                    continue

                // console.log('is prefix : ' + newWordFragment)

                // Generate new available tiles and cell fragment
                var newAvailableTiles = availableTiles.slice()
                var newTile = newAvailableTiles.splice(i, 1)[0] // remove and get new cell
                var newCellsFragment = cellsFragment.slice()
                newCellsFragment.push(newTile) // push to new

                if (dictionary.has(newWordFragment.toLowerCase())) { // complete match

                    // console.log('found : ' + newWordFragment + ' at ' + JSON.stringify(newCellsFragment))

                    // Update words and combs
                    if (words.has(newWordFragment)) {
                        combs[words.get(newWordFragment)].push(playI)
                    }
                    else {
                        words.set(newWordFragment, wordI)
                        combs.push([playI])
                        wordI++
                    }

                    // Update plays
                    var play = new Play(newWordFragment, newCellsFragment)
                    plays.push(play)
                    playI++
                }

                // Remove earlier cells of the same letter to avoid duplicate search
                var maxIndex = i;
                for (var j = 0; j < maxIndex; j++) {
                    // console.log(newAvailableTiles[j], newLetter)
                    if (letters[newAvailableTiles[j]] === newLetter) {
                        newAvailableTiles.splice(j, 1)
                        j--
                        maxIndex--
                    }
                }
                if (newAvailableTiles.length === 0)
                    continue

                // Recurse down
                genPlaysHelper(newAvailableTiles, newCellsFragment, newWordFragment);
            }
        }
        return { 'words' : words, 'combs' : combs, 'plays' : plays }
    }

    /**
     * Get all moves possible on the board as move indexes.
     * @return {number[]} The array of all move indexes.
     */
    allPlays() {
        var plays = [ ]
        for (var i = 0; i < this.plays.length; i++) {
            plays.push(i)
        }
        return plays
    }

    /**
     * Restore a Play object from its move index.
     * @param {number} index - The move index.
     * @return {Play} The Play object.
     */
    actualize(index) {
        return this.plays[index]
    }

    /**
     * Get all move combinations of a word as an array of move indexes.
     * @param {string} word - The word.
     * @return {number[]} The array of move indexes that correspond to the word.
     */
    getPlays(word) {
        var wordI = this.words.get(word)
        if (wordI === undefined)
            return [ ]
        return this.combs[wordI]
    }

    /**
     * Same as getPlays, but also returns all plays that are prefixes.
     * @param {string} word - The word.
     * @return {number[]} The array of move indexes that correspond to the word and its prefixes.
     */
    getPrefixes(word) {
        var plays = [ ]
        while (word.length > 1) {
            var combs = this.getPlays(word)
            for (var i = 0; i < combs.length; i++) {
                plays.push(combs[i])
            }
            word = word.slice(0, -1)
        }
        return plays
    }
}

module.exports = WordPlayMap
