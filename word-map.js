'use strict'

// Multi-map of unique words to non-unique arrays of cells
class WordMap {

    constructor(map, plays) {
        this.map = map || new Map() // Map words to their variations of plays
        this.plays = plays || [ ] // Complete array of all plays (which are indexes)
    }
    
    insert(word, cells) {
        var cellsArr = this.map.get(word) || [ ]
        cellsArr.push(cells)
        this.map.set(word, cellsArr)

        this.plays.push(cells)
    }

    remove(word) {
        // This works because insertion order is guaranteed
        var newPlays = [ ]
        var variations = this.map.get(word)
        if (variations === undefined)
            return false
        var index = 0
        for (var i = 0; i < this.plays.length && index < variations.length; i++) {
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
