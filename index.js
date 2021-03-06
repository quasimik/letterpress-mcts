'use strict'

const express = require('express')
const app = express()
// app.set("view engine", "html");

const Board = require('./board.js')
const MonteCarlo = require('./monte-carlo.js')

var letterBoard5_nat = [
    'W', 'Y', 'P', 'R', 'L',
    'D', 'B', 'N', 'N', 'H',
    'J', 'E', 'Y', 'O', 'M',
    'E', 'T', 'I', 'A', 'S',
    'S', 'B', 'E', 'H', 'M' ]

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
    'E', 'T' ]

var letterBoard0 = [
    'C', 'O', 'O',
    'O', 'L', 'C' ]

// var board = new Board(letterBoard5_nat, 5, 5, 1)
// var board = new Board(letterBoard5, 5, 5, 1)
// var board = new Board(letterBoard4, 4, 4, 1)
var board = new Board(letterBoard3, 3, 3, 1)
// var board = new Board(letterBoard2, 2, 2, 1)
// var board = new Board(letterBoard0, 2, 3, 1)

var state = board.start()
console.log('legal plays : ' + board.legalPlays(state).length)

var mc = new MonteCarlo(board, 100)
mc.update(state)
var play = mc.getPlay(5)
if (play)
    console.log('best play : ' + play.word + ' at ' + play.cells)
else
    console.log('INSUFFICIENT DATA FOR MEANINGFUL ANSWER.')

app.get('/', function(request, response) {
    response.send('hi')
})

// app.listen(3000, function() {
//     console.log('listening on port 3000...')
// })
