'use strict'

const StatNode = require('./stat-node.js')

class MonteCarlo {

    constructor(board, maxDepth) {
        this.board = board
        this.maxDepth = maxDepth || Infinity
        this.state = null // Current state node

        this.nodes = new Map() // Map State hashes to StatNodes
        // Add: Map state + play hashes to states? i.e. next_state cache?
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
        console.log(this.state.hash, ' : (', this.nodes.get(this.state.hash).wins, '/', this.nodes.get(this.state.hash).plays, ')')

        // Get best play (highest wins)
        var legal = this.board.legal_plays(this.state)
        var maxWins = 0
        var play
        for (var pPlay of legal) {
            var pState = this.board.next_state(this.state, pPlay) // TODO: move this to cache
            var pWins = this.nodes.get(pState.hash).wins
            if (pWins > maxWins) {
                play = pPlay
                maxWins = pWins
            }
        }
        return play
    }

    run_simulation() {
        /* Play one random game to completion from current state,
        ** then update statistics table.
        */

        var state = this.state // No need to copy because we do not modify it
        var node = this.nodes.get(state.hash)

        var visitedStates = new Set()
        visitedStates.add(state)
        
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
            var play
            if (legal.length === 1) {
                // console.log('one')
                play = legal[0]
            }
            else if (node !== undefined && node.fullyExpanded()) {
                // console.log('stats')
                var maxUCB1 = 0
                for (var pPlay of legal) {
                    var pState = this.board.next_state(state, pPlay) // TODO: move this to cache
                    // console.log(pState.hash)
                    var pUCB1 = this.nodes.get(pState.hash).getUCB1()
                    // console.log(pState.hash + ' : ' + pUCB1)
                    if (pUCB1 > maxUCB1) {
                        play = pPlay
                        maxUCB1 = pUCB1
                    }
                }
            }
            else {
                // console.log('random')
                play = legal[Math.floor(Math.random() * legal.length)]
            }

            // Advance the state and node
            var newState = this.board.next_state(state, play)
            var newNode = this.nodes.get(newState.hash)

            // console.log('at : ' + state.hash)

            // Expand the first unexpanded state this simulation run
            if (expand && newNode === undefined) {

                // console.log('expanding : ' + newState.hash)

                newNode = new StatNode()
                newNode.parent = node
                newNode.totalChildren = this.board.legal_plays(newState).length
                this.nodes.get(state.hash).children.add(newNode)
                this.nodes.set(newState.hash, newNode)
            }

            // Track visited states for backpropagation
            if (newNode !== undefined) { // Only add expanded states
                visitedStates.add(newState)
            }

            winner = this.board.winner(newState)
            if (winner !== 0)
                break

            state = newState
            node = newNode
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
            // console.log('no winner')
            // TODO: figure out what to do when no winner
        }
    }
}

module.exports = MonteCarlo
