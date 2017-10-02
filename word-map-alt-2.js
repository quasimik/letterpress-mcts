'use strict'

const Play = require('./play.js')

// Multi-map of unique words to non-unique arrays of cells
class WordMap {

    constructor(map, arr) {
        this.wordMap = map || new Map() // Map words to cells
        this.cells = arr || [ ] // Set of cells
    }
    
    insert(word, cells) {
        var cellsArr = this.wordMap.get(word) || [ ]
        cellsArr.push(cells)
        this.wordMap.set(word, cellsArr)
        this.cells.add(cells)
    }

    remove(word) { // Only remove words
        // console.log('remove ' + word)
        for (var cells of this.wordMap.get(word)) {
            this.cells.delete(cells)
        }
        this.wordMap.delete(word)
    }

    copy() {
        var map = new Map(this.wordMap)
        var set = new Set(this.cells)
        var newWordMap = new WordMap(map, set)
        return newWordMap
    }

    get plays() {
        return [...this.cells]
    }
}

module.exports = WordMap
