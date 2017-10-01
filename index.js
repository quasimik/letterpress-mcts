'use strict'

const express = require('express')
const app = express()
// app.set("view engine", "html");

// const genState = require('./generate-state.js')
const Board = require('./board.js')
const MonteCarlo = require('./monte-carlo.js')

var letterBoard5 = [
    'U', 'I', 'T', 'A', 'C',
    'E', 'V', 'I', 'H', 'T',
    'S', 'A', 'K', 'E', 'L',
    'W', 'R', 'S', 'R', 'H',
    'N', 'T', 'D', 'H', 'M' ]

var letterBoard4 = [
    'U', 'I', 'T', 'A',
    'E', 'V', 'I', 'H',
    'S', 'A', 'K', 'E',
    'W', 'R', 'S', 'R' ]

var letterBoard3 = [
    'U', 'I', 'T',
    'E', 'V', 'I',
    'S', 'A', 'K' ]

var letterBoard2 = [
    'P', 'I',
    'E', 'T']

var letterBoard0 = [
    'C', 'O', 'O',
    'O', 'L', 'C' ]

// var board = new Board(letterBoard5, 5, 5, 1)
// var board = new Board(letterBoard4, 4, 4, 1)
var board = new Board(letterBoard3, 3, 3, 1)
// var board = new Board(letterBoard2, 2, 2, 1)
// var board = new Board(letterBoard0, 2, 3, 1)
var state = board.start()
console.log(board.legal_plays(state))

var mc = new MonteCarlo(board, 100)
mc.update(state)
var play = mc.get_play(2)
console.log('best play : ' + play)

// console.log(board.legal_plays(state))
// console.log(state.score)
// console.log(state.hash)
// var play = board.legal_plays(state)[1]
// console.log(play)
// var newState = board.next_state(state, play)
// console.log(state.hash)
// console.log(newState.hash)

app.get('/', function(request, response) {
    response.send(plays.getLongestWord())
})

// app.listen(3000, function() {
//     console.log('listening on port 3000...')
// })
