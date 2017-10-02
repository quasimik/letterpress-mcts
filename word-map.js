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
        // This works because the order is guaranteed
        var newPlays = [ ]
        var variations = this.map.get(word)
        if (variations === undefined)
            return false
        var index = 0
        for (var play of this.plays) {
            if (play !== variations[index]) {
                newPlays.push(play)
            }
            else {
                index++
            }
        }
        this.plays = newPlays
        return this.map.delete(word)
    }

    copy() {
        var map = new Map(this.map)
        var plays = this.plays.slice()
        return new WordMap(map, plays)
    }
}

module.exports = WordMap
