'use strict'

// Multi-map of unique words to non-unique arrays of cells
class WordMap {

    constructor(map) {
        this.wordMap = map || new Map() // Map words to arrays of cells
    }
    
    insert(word, cells) {
        var cellsArr = this.wordMap.get(word) || [ ]
        cellsArr.push(cells)
        this.wordMap.set(word, cellsArr)
    }

    remove(word) { // Only remove words
        return this.wordMap.delete(word)
    }

    copy() {
        var newMap = new Map(this.wordMap)
        var newWordMap = new WordMap(newMap)
        return newWordMap
    }

    get plays() { // Return cells without words
        var plays = [ ]
        for (var variations of this.wordMap.values()) {
            for (var cells of variations) {
                plays.push(cells)
            }
        }
        return plays
    }
}

module.exports = WordMap
