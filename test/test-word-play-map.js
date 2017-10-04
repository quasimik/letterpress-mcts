const assert = require('assert')
const WordPlayMap = require('../word-play-map.js')

describe('WordPlayMap', () => {

    var letters = [ 'C', 'O', 'O', 'O', 'L', 'C' ]
    var wpm = new WordPlayMap(letters)
    
    for (var play of wpm.allPlays()) {
        console.log(wpm.actualize(play))
    }

    var wordCheck = ['OO', 'LO', 'LOO', 'LOCO', 'COO', 'COL', 'COOL', 'COCO']
    it('generates words properly', () => {
        assert.equal(wpm.words.size, 8)
        for (var word of wordCheck) {
            assert(wpm.words.has(word))
        }
        assert(!wpm.words.has('LOL'))
    })
    it('generates combs properly', () => {
        assert.equal(wpm.combs.length, 8)
        assert.equal(wpm.combs[wpm.words.get('OO')].length, 3)
        assert.equal(wpm.combs[wpm.words.get('LO')].length, 3)
        assert.equal(wpm.combs[wpm.words.get('LOO')].length, 3)
        assert.equal(wpm.combs[wpm.words.get('LOCO')].length, 6)
        assert.equal(wpm.combs[wpm.words.get('COO')].length, 6)
        assert.equal(wpm.combs[wpm.words.get('COL')].length, 6)
        assert.equal(wpm.combs[wpm.words.get('COOL')].length, 6)
        assert.equal(wpm.combs[wpm.words.get('COCO')].length, 3)
        assert(wpm.combs[wpm.words.get('LOL')] === undefined)
    })
    it('generates plays properly', () => {
        assert.equal(wpm.plays.length, 36)
        assert.equal(wpm.allPlays().length, 36)

        assert.equal(wpm.plays[wpm.combs[wpm.words.get('LO')][0]].word, 'LO')
        assert.equal(wpm.plays[wpm.combs[wpm.words.get('LO')][1]].word, 'LO')
        assert.equal(wpm.plays[wpm.combs[wpm.words.get('LO')][2]].word, 'LO')
        assert.equal(wpm.plays[wpm.combs[wpm.words.get('LO')][3]], undefined)

        var lo = new Set()
        for (var i = 0; i < 3; i++) {
            lo.add(wpm.plays[wpm.combs[wpm.words.get('LO')][i]].cells.toString())
        }
        assert(lo.has('4,1'))
        assert(lo.has('4,2'))
        assert(lo.has('4,3'))

        var cool = new Set()
        for (var i = 0; i < 6; i++) {
            cool.add(wpm.plays[wpm.combs[wpm.words.get('COOL')][i]].cells.toString())
        }
        assert(cool.has('0,1,2,4'))
        assert(cool.has('0,1,3,4'))
        assert(cool.has('0,2,3,4'))
        assert(cool.has('5,1,2,4'))
        assert(cool.has('5,1,3,4'))
        assert(cool.has('5,2,3,4'))
    })
    
})
