const assert = require('assert')
const LegalCache = require('../legal-cache.js')

describe('LegalCache', () => {

    var plays = [0, 1, 2, 3, 4,    6, 7, 8]
    var lc = new LegalCache(plays)

    it('has sane initial values', () => {
        assert.equal(lc.plays.length, 8)
        assert.equal(lc.plays.indexOf(0), 0)
        assert.equal(lc.plays.indexOf(4), 4)
        assert.equal(lc.plays.indexOf(5), -1)
        assert.equal(lc.plays.indexOf(6), 5)
        assert.equal(lc.plays.indexOf(8), 7)
    })
    it('removes plays properly', () => {
        var playsToRemove = [0, 4, 8]
        lc.remove(playsToRemove)
        assert.equal(lc.plays.length, 5)
        assert.equal(lc.plays.indexOf(0), -1)
        assert.equal(lc.plays.indexOf(1), 0)
        assert.equal(lc.plays.indexOf(2), 1)
        assert.equal(lc.plays.indexOf(3), 2)
        assert.equal(lc.plays.indexOf(4), -1)
        assert.equal(lc.plays.indexOf(5), -1)
        assert.equal(lc.plays.indexOf(6), 3)
        assert.equal(lc.plays.indexOf(7), 4)
        assert.equal(lc.plays.indexOf(8), -1)
    })
    it('copies without affecting other instances', () => {
        var lc2 = lc.copy()
        assert.equal(lc.plays.length, 5)
        assert.equal(lc.plays.indexOf(1), 0)
        assert.equal(lc2.plays.length, 5)
        assert.equal(lc2.plays.indexOf(1), 0)

        lc.remove([1])
        
        assert.equal(lc.plays.length, 4)
        assert.equal(lc.plays.indexOf(1), -1)
        assert.equal(lc2.plays.length, 5)
        assert.equal(lc2.plays.indexOf(1), 0)
        
        lc2.remove([7])
        
        assert.equal(lc.plays.length, 4)
        assert.equal(lc.plays.indexOf(7), 3)
        assert.equal(lc2.plays.length, 4)
        assert.equal(lc2.plays.indexOf(7), -1)
    })
})
