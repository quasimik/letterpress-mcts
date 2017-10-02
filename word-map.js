'use strict'

// Multi-map of unique words to non-unique arrays of cells
class WordMap {

    constructor(map, plays) {
        this.map = map || new Map()
        this.plays = plays || [ ] // Cells only
    }
    
    insert(word, cells) {
        var cellsArr = this.map.get(word) || [ ]
        cellsArr.push(cells)
        this.map.set(word, cellsArr)

        this.plays.push(cells)
    }

    remove(word) {
        // This works because insertion order is guaranteed
        // Optimization idea: keep track of indexes for fast splice()
        var newPlays = [ ]
        var variations = this.map.get(word)
        if (variations === undefined)
            return false
        var index = 0
        for (var i = 0; i < this.plays.length; i++) {
            if (this.plays[i] === variations[index]) {
                this.plays.splice(i, 1)
                i--
                index++
            }
        }
        return this.map.delete(word)
    }

    copy() {
        var map = new Map(this.map)
        var plays = this.plays.slice()
        return new WordMap(map, plays)
    }
}

module.exports = WordMap
