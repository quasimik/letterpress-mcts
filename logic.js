const createBoard = require('2d-board')
// const createDictionary = require('./dictionary.js')
const createDictionary = require('dictionatrie')
const WordMap = require('./word-map.js')
// const Map = require("collections/map")
// const SortedMap = require("collections/sorted-map")
// const MultiMap = require("collections/multi-map")
// const std = require('tstl')
// var TreeMultiMap = require("dsjslib").TreeMultiMap

var dictionary = createDictionary()

var letterBoard5 = createBoard(5, 5)
letterBoard5.rows([
    [ 'U', 'I', 'T', 'A', 'C' ],
    [ 'E', 'V', 'I', 'H', 'T' ],
    [ 'S', 'A', 'K', 'E', 'L' ],
    [ 'W', 'R', 'S', 'R', 'H' ],
    [ 'N', 'T', 'D', 'H', 'M' ]])

var letterBoard4 = createBoard(4, 4)
letterBoard4.rows([
    [ 'U', 'I', 'T', 'A' ],
    [ 'E', 'V', 'I', 'H' ],
    [ 'S', 'A', 'K', 'E' ],
    [ 'W', 'R', 'S', 'R' ]])

var letterBoard3 = createBoard(3, 3)
letterBoard3.rows([
    [ 'U', 'I', 'T' ],
    [ 'E', 'V', 'I' ],
    [ 'S', 'A', 'K' ]])

var letterBoard0 = createBoard(3, 2)
letterBoard0.rows([
    [ 'C', 'O', 'O' ],
    [ 'O', 'L', 'C' ]])

var ownerBoard = createBoard(5, 5)

function genAvailableTiles(board) {
    var availableTiles = [ ];
    for (var i = 0; i < board.numRows; i++) {
        for (var j = 0; j < board.numCols; j++) {
            var cell = [j, i];
            availableTiles.push({
                "cell": cell,
                "letter": board.val(cell)
            });
        }
    }
    return availableTiles;
}

var plays = new WordMap()

function genPlaysHelper(availableTiles, cellsFragment, wordFragment) {
    if (availableTiles.length === 0)
        return

    for (var i = 0; i < availableTiles.length; i++) {
        
        var newLetter = availableTiles[i]['letter']

        // Check if this new word fragement is a prefix of any real word
        var newWordFragment = wordFragment + newLetter
        if (!dictionary.has(newWordFragment.toLowerCase(), true)) // partial (prefix) match
            continue

        // console.log('at: ' + newWordFragment)

        // Generate new available tiles and cell fragment
        var newAvailableTiles = availableTiles.slice()
        var newCell = newAvailableTiles.splice(i, 1)[0]['cell'] // remove and get new cell
        var newCellsFragment = cellsFragment.slice()
        newCellsFragment.push(newCell) // push to new

        if (dictionary.has(newWordFragment.toLowerCase())) { // complete match
            // console.log('found: ' + newWordFragment + ' at ' + JSON.stringify(newCellsFragment))
            plays.insert(newWordFragment, newCellsFragment)
            // console.log(plays.inspect())
        }

        // Remove earlier cells of the same letter to avoid duplicate search
        var maxIndex = i;
        for (var j = 0; j < maxIndex; j++) {
            if (newAvailableTiles[j]['letter'] === newLetter) {
                newAvailableTiles.splice(j, 1)
                j--
                maxIndex--
            }
        }
        if (newAvailableTiles.length === 0)
            continue

        // Recurse down
        genPlaysHelper(newAvailableTiles, newCellsFragment, newWordFragment);
    }
}

function genPlays(board) {
    var availableTiles = genAvailableTiles(board);
    // console.log(JSON.stringify(availableTiles))
    genPlaysHelper(availableTiles, [ ], '');
}

exports.get = function(request, response) {
    genPlays(letterBoard5);
    console.log(plays.inspect())
    return plays
};
