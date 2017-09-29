'use strict'

const Play = require('./play.js')

// Multi-map of unique words to non-unique arrays of cells
class WordMap {

    constructor() {
        this.wordMap = new Map(); // map words to arrays of cells
    }
    
    insert(word, cells) {
        var cellsArr = this.wordMap.get(word) || [ ]
        cellsArr.push(cells)
        this.wordMap.set(word, cellsArr)
    }

    remove(word) { // Only remove words
        this.wordMap.delete(word)
    }

    get plays() {
        var plays = [ ]
        for (var [word, variations] of this.wordMap) {
            for (var cells of variations) {
                plays.push([word, cells])
            }
        }
        return plays
    }
}

module.exports = WordMap
