'use strict'

const WordMap = require('./word-map.js')
const Dictionary = require('dictionatrie')
var dictionary = Dictionary()

class State {

    constructor(ownership, playedWords, nextToPlay, wordMap) {
        this.ownership = ownership || []
        this.playedWords = playedWords || []
        this.nextToPlay = nextToPlay || 1
        this.wordMap = wordMap || new WordMap()
    }

    static generateWordMap(letters) {

        var wordMap = new WordMap()
        var numRows = letters.length
        var numCols = letters[0].length

        function genPlaysHelper(availableTiles, cellsFragment, wordFragment) {
            if (availableTiles.length === 0)
                return

            for (var i = 0; i < availableTiles.length; i++) {
                
                var row = Math.floor(availableTiles[i] / numCols)
                var col = availableTiles[i] % numCols
                var newLetter = letters[row][col]

                // Check if this new word fragement is a prefix of any real word
                var newWordFragment = wordFragment + newLetter
                // console.log('at: ' + newWordFragment + ' (' + row + ',' + col + ')')
                if (!dictionary.has(newWordFragment.toLowerCase(), true)) // partial (prefix) match
                    continue

                // console.log('is prefix: ' + newWordFragment)

                // Generate new available tiles and cell fragment
                var newAvailableTiles = availableTiles.slice()
                var newTile = newAvailableTiles.splice(i, 1)[0] // remove and get new cell
                var newCellsFragment = cellsFragment.slice()
                newCellsFragment.push(newTile) // push to new

                if (dictionary.has(newWordFragment.toLowerCase())) { // complete match
                    // console.log('found: ' + newWordFragment + ' at ' + JSON.stringify(newCellsFragment))
                    wordMap.insert(newWordFragment, newCellsFragment)
                    // console.log(plays.inspect())
                }

                // Remove earlier cells of the same letter to avoid duplicate search
                var maxIndex = i;
                for (var j = 0; j < maxIndex; j++) {
                    // console.log(newAvailableTiles[j], newLetter)
                    var row = Math.floor(newAvailableTiles[j] / numCols)
                    var col = newAvailableTiles[j] % numCols
                    if (letters[row][col] === newLetter) {
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

        var availableTiles = [ ]
        for (var i = 0; i < numRows * numCols; i++) {
            availableTiles.push(i)
        }

        // console.log(JSON.stringify(availableTiles))
        genPlaysHelper(availableTiles, [ ], '');

        return wordMap
    }

    get plays() {
        return this.wordMap.plays
    }

    get score() {
        var score = 0
        for (var row of this.ownership) {
            for (var own of row) {
                score += own
            }
        }
        return score
    }

    get hash() {
        // Letters are always the same
        var hash = ''
        for (var row of this.ownership) {
            for (var own of row) {
                hash += own
            }
        }
        this.playedWords.sort()
        hash += this.playedWords.toString()
        hash += '|' + this.nextToPlay
        return hash
    }
}

module.exports = State
