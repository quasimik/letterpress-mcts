'use strict'

class LegalCache {
    /* Cached legal play indexes
    */

    constructor(plays) {
        this.plays = plays // [playI, playI, ...]
    }

    remove(plays) {
        /* plays : [playI, playI, ...]
        ** plays must be in insertion order
        */
        
        // console.log('plays : ' + this.plays.length)
        // console.log('remove : ' + plays.length)

        var playI = 0
        for (var i = 0; i < this.plays.length && playI < plays.length; i++) {
            if (this.plays[i] === plays[playI]) {
                this.plays.splice(i, 1)
                i--
                playI++
            }
        }
    }

    copy() {
        return new LegalCache(this.plays.slice())
    }
}

module.exports = LegalCache
