'use strict'

const StatNode = require('./stat-node.js')

class MonteCarlo {

    constructor(board, maxDepth) {
        this.board = board
        this.maxDepth = maxDepth || Infinity
        this.state = null // Current state node

        this.nodes = new Map() // Map State hashes to StatNodes
    }

    update(state) {
        /* Update state which we want to find the best play for
        */

        this.state = state
        if (!this.nodes.has(state)) {
            var node = new StatNode()
            node.totalChildren = this.board.legal_plays(state).length
            this.nodes.set(state.hash, node)
        }
    }

    get_play(timeSeconds) {
        /* Calculate the best move from current state and return it
        */

        var games = 0
        var start = Date.now()
        while (Date.now() < start + timeSeconds * 1000) {
            this.run_simulation()
            games++
        }
        console.log('games run: ' + games)

        // Output statistics for depth=1 nodes
        console.log('-----')
        var depth1Nodes = this.nodes.get(this.state.hash).children
        for (var [hash, node] of this.nodes) {
            if (!depth1Nodes.has(node))
                continue

            console.log(hash, ' : (', node.wins, '/', node.plays, ')')
        }

        return
    }

    run_simulation() {
        /* Play one random game to completion from current state,
        ** then update statistics table.
        */

        var state = this.state // No need to copy because we do not modify it
        var visitedStates = new Set()
        var winner = null

        // console.log('root : ' + state.hash)

        // Run simulation
        var expand = true // Expand once per simulation
        for (var depth = 0; depth < this.maxDepth; depth++) {

            // Get legal plays
            var legal = this.board.legal_plays(state)
            // console.log('state : ' + state.hash)
            // console.log('legal : ' + legal)
            if (legal.length === 0)
                break

            // Choose a play
            var play = legal[Math.floor(Math.random() * legal.length)]

            // Advance the state
            var newState = this.board.next_state(state, play)
            var node = this.nodes.get(newState.hash)

            // console.log('at : ' + state.hash)

            // Expand the first unexpanded state this simulation run
            if (expand && node === undefined) {

                // console.log('expanding : ' + newState.hash)

                node = new StatNode()
                node.totalChildren = this.board.legal_plays(newState).length
                this.nodes.get(state.hash).children.add(node)
                this.nodes.set(newState.hash, node)
            }

            // Track visited states for backpropagation
            if (node !== undefined) { // Only add expanded states
                visitedStates.add(newState)
            }

            state = newState

            winner = this.board.winner(state)
            if (winner !== 0)
                break
        }

        // Backpropagate
        if (winner !== 0) {
            // console.log('winner : ' + winner)
            for (var state of visitedStates) {
                var node = this.nodes.get(state.hash)
                node.plays++
                if (state.currentPlayer === -winner) {
                    node.wins++
                }
            }
        }
        else {
            console.log('no winner')
        }
    }

    static getUCB1(totalPlays, plays, wins, biasParam) {
        var bias = biasParam || 2;
        // process.stdout.write(wins + " " + plays + " " + bias + " " + this.parent.visits + " " + plays + "\n");
        return (wins / plays) + Math.sqrt(bias * Math.log(totalPlays) / plays);
    }
}

module.exports = MonteCarlo
