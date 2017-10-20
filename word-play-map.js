'use strict'

const os = require('os')
const Play = require('./play.js')
const Dictionary = require('dictionatrie')
const fs = require('fs')
const words = fs.readFileSync('./word-lists/letterpress.txt', 'utf8').split(os.EOL)
const dictionary = new Dictionary(words)

class WordPlayMap {
    /* Backing store of all plays
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

    static genPlays(letters) {
        /* Generate everything
        */

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

    allPlays() {
        /* Get all plays possible on the board
        */

        var plays = [ ]
        for (var i = 0; i < this.plays.length; i++) {
            plays.push(i)
        }
        return plays
    }

    actualize(playI) {
        return this.plays[playI]
    }

    getPlays(word) {
        /* Get all plays using given word as an array of play indexes
        */

        var wordI = this.words.get(word)
        return this.combs[wordI]
    }
}

module.exports = WordPlayMap
