'use strict'

const Play = require('./play.js')
const Dictionary = require('dictionatrie')
const fs = require('fs')
const words = fs.readFileSync('./enable1.txt', 'utf8').split('\n')
const dictionary = Dictionary(words)

// Backing store of all plays in the given letters
class Plays {

    constructor(letters) {

        console.log('generating plays...')
        var start = Date.now()
        var gen = Plays.genPlays(letters)
        var duration = Math.floor((Date.now() - start) / 1000)
        console.log('generated ' + gen.plays.length + ' plays in ' + duration + ' seconds')

        this.map = gen.map // Maps words to indexes of plays
        this.plays = gen.plays // Array of all plays
    }

    static genPlays(letters) {
        /* Generate plays
        */

        var map = new Map()
        var plays = [ ]

        var availableTiles = [ ]
        for (var i = 0; i < letters.length; i++)
            availableTiles.push(i)
        var playIndex = 0
        genPlaysHelper(availableTiles, [ ], '');

        function genPlaysHelper(availableTiles, cellsFragment, wordFragment) {
            if (availableTiles.length === 0)
                return

            for (var i = 0; i < availableTiles.length; i++) {
                
                var newLetter = letters[availableTiles[i]]

                // Check if this new word fragement is a prefix of any real word
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

                    // Update map
                    var variations = map.get(newWordFragment) || [ ]
                    variations.push(playIndex)
                    map.set(newWordFragment, variations)
                    playIndex++

                    // Update plays
                    var play = new Play(newWordFragment, newCellsFragment)
                    plays.push(play)
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

        var gen = { 'map' : map, 'plays' : plays }
        return gen
    }

    getPlay(playIndex) {
        return this.plays[playIndex]
    }

    getLegalPlayIndexes(playedWords) { // Probably super slow
        var legalPlays = [ ]
        for (var [word, variations] of this.map) {
            var push = true
            for (var i = 0; i < playedWords.length; i++) {
                if (word === playedWords[i])
                    push = false
            }
            if (push) {
                for (var i = 0; i < variations.length; i++) {
                    legalPlays.push(variations[i])
                }
            }
        }
        return legalPlays
    }
}

module.exports = Plays
