'use strict'

const Play = require('./play.js')

// Multi-map of unique words to non-unique arrays of cells
class WordMap {

    constructor(plays) {
        this.plays = plays || [ ];
    }
    
    insert(word, cells) {
        this.plays.push([word, cells])
    }

    remove(word) {
        var plays = [ ]
        for (var play of this.plays) {
            if (play[0] !== word) {
                plays.push(play)
            }
        }
        this.plays = plays
    }

    copy() {
        var plays = [ ]
        for (var i = 0; i < this.plays.length; i++) {
            plays[i] = this.plays[i].slice()
        }
        return new WordMap(plays)
    }
}

module.exports = WordMap
