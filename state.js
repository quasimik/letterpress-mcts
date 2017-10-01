'use strict'

const WordMap = require('./word-map.js')
const Dictionary = require('dictionatrie')
var dictionary = Dictionary()

class State {

    constructor(ownership, playedWords, currentPlayer, wordMap) {
        this.ownership = ownership || []
        this.playedWords = playedWords || []
        this.currentPlayer = currentPlayer || 1
        this.wordMap = wordMap || new WordMap()
    }

    static generateWordMap(letters, numRows, numCols) {
        var wordMap = new WordMap()

        function genPlaysHelper(availableTiles, cellsFragment, wordFragment) {
            if (availableTiles.length === 0)
                return

            for (var i = 0; i < availableTiles.length; i++) {
                
                var newLetter = letters[availableTiles[i]]

                // Check if this new word fragement is a prefix of any real word
                var newWordFragment = wordFragment + newLetter
                // console.log('at: ' + newWordFragment + ' (' + availableTiles[i] + ')')
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

        var availableTiles = [ ]
        for (var i = 0; i < numRows * numCols; i++) {
            availableTiles.push(i)
        }
        // console.log(letters)
        // console.log(availableTiles)

        // console.log(JSON.stringify(availableTiles))
        genPlaysHelper(availableTiles, [ ], '');

        return wordMap
    }

    get plays() {
        return this.wordMap.plays
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
