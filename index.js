'use strict'

const express = require('express')
const app = express()
// app.set("view engine", "html");

// const genState = require('./generate-state.js')
const Board = require('./board.js')

var letterBoard5 = [
    [ 'U', 'I', 'T', 'A', 'C' ],
    [ 'E', 'V', 'I', 'H', 'T' ],
    [ 'S', 'A', 'K', 'E', 'L' ],
    [ 'W', 'R', 'S', 'R', 'H' ],
    [ 'N', 'T', 'D', 'H', 'M' ]]

var letterBoard4 = [
    [ 'U', 'I', 'T', 'A' ],
    [ 'E', 'V', 'I', 'H' ],
    [ 'S', 'A', 'K', 'E' ],
    [ 'W', 'R', 'S', 'R' ]]

var letterBoard3 = [
    [ 'U', 'I', 'T' ],
    [ 'E', 'V', 'I' ],
    [ 'S', 'A', 'K' ]]

var letterBoard0 = [
    [ 'C', 'O', 'O' ],
    [ 'O', 'L', 'C' ]]

var board = new Board(letterBoard4, 1)
var state = board.start()
console.log(board.legal_plays(state).length)
console.log(state.score)
console.log(state.hash)
// var plays = genState.get();

app.get('/', function(request, response) {
    response.send(plays.getLongestWord())
})

// app.listen(3000, function() {
//     console.log('listening on port 3000...')
// })
