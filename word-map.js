(function() {
    "use strict";

    function _WordMap() {
        var self = this;
        self.wordMap = new Map(); // map words to arrays of cells
        self.lengthMap = new Map(); // map word lengths to words
        self.totalVariations = 0;
    }
    
    _WordMap.prototype.insert = function(word, cells) {
        // Set word map
        var cellsArr = this.wordMap.get(word)
        var newWord = false
        if (cellsArr === undefined) {
            cellsArr = [ ]
            newWord = true
        }
        cellsArr.push(cells)
        this.wordMap.set(word, cellsArr)

        // If new word, set length map
        if (newWord) {
            var wordsArr = this.lengthMap.get(word.length)
            if (wordsArr === undefined) wordsArr = [ ]
            wordsArr.push(word)
            this.lengthMap.set(word.length, wordsArr)
        }

        this.totalVariations++
    }

    _WordMap.prototype.remove = function(word) {
        this.wordMap.delete(word)
        var wordsArr = this.lengthMap.find(word.length)
        if (wordsArr.length > 1) { // Not the last word of this length
            var wordIndex = wordsArr.indexOf(word)
            wordArr.splice(wordIndex, 1)
        }
        else { // Last word of this length
            this.lengthMap.delete(word.length)
        }
        // if (cells === undefined) 
        // // Delete from word map
        // var cellsArr = this.wordMap.get(word)
        // if (cellsArr === undefined) return false
        // if (cellsArr.length > 1) { // Not the last element
        //     var cellIndex = cellsArr.findIndex(function(cellElement) {
        //         return (cellElement[0] === cells[0] && cellElement[1] === cells[1])
        //     })
        //     if (cellIndex === -1)
        //         return false
        //     cellsArr.splice(cellIndex, 1)
        // }
        // else { // Last element, delete from both maps
        //     this.wordMap.delete(word)
        //     this.removeLengthMap(word)
        // }
    }

    _WordMap.prototype.getLongestWord = function() {
        var longestLength = 0;
        this.lengthMap.forEach(function(value, key, map) {
            if (key > longestLength) {
                longestLength = key
            }
        })
        // Doesn't matter which longest word returns
        return this.lengthMap.get(longestLength)[0]
    }

    _WordMap.prototype.getSize = function() {
        return this.wordMap.size
    }

    _WordMap.prototype.wordLengthStats = function() {
        var string = ''
        var longestLength = 0;
        this.lengthMap.forEach(function(value, key, map) {
            if (key > longestLength) {
                longestLength = key
            }
        })
        for (var i = longestLength; i > 0; i--) {
            var wordsArr = this.lengthMap.get(i)
            if (wordsArr) {
                var variations = 0
                for (var word of wordsArr) {
                    variations += this.wordMap.get(word).length
                }
                string += i + ' : ' + wordsArr.length + ' words, ' + variations + ' variations\n'
            }
        }
        return string
    }

    _WordMap.prototype.inspect = function() {
        var string = ''
        string += 'longest word: ' + this.getLongestWord() + '\n'
        string += 'total words: ' + this.getSize() + '\n'
        string += 'total variations: ' + this.totalVariations + '\n'
        string += '----- word length stats -----' + '\n'
        string += this.wordLengthStats()
        return string
    }

    _WordMap.prototype.showWords = function(limit) {
        var limit = limit || Infinity
        var string = ''
        this.wordMap.forEach(function(value, key, map) {
            if (limit <= 0) return
            string += key + ' : ' + value.length + ' variations'
            string += '\n'
            limit--
        })
        return string
    }
    
    module.exports = function WordMap() {
        return new _WordMap();
    }
    
})();
