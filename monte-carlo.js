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
            node.unexpandedPlays = this.board.legal_plays(state)
            // node.totalChildren = this.board.legal_plays(state).length
            this.nodes.set(state.hash, node)
        }
    }

    get_play(timeSeconds) {
        /* Calculate the best move from current state and return it
        */

        var sims = 0
        var start = Date.now()
        var end = start + timeSeconds * 1000
        var notify = 3

        // Run simulations
        while (Date.now() < end) {
            if (Date.now() > start + notify * 1000) { // Notify every 3 seconds
                console.log(notify + '/' + timeSeconds + ' seconds : ' + sims + ' simulations')
                notify += 3
            }
            this.run_simulation()
            sims++
        }

        console.log('simulations run : ' + sims)

        // // Output statistics for depth=1 nodes
        // console.log('-----')
        // var depth1Nodes = this.nodes.get(this.state.hash).children
        // for (var [hash, node] of this.nodes) {
        //     if (!depth1Nodes.has(node))
        //         continue

        //     console.log(hash, ' : (', node.wins, '/', node.plays, ')')
        // }
        // console.log(this.state.hash, ' : (', this.nodes.get(this.state.hash).wins, '/', this.nodes.get(this.state.hash).plays, ')')

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

        // Run simulation
        var expand = true // Expand once per simulation
        for (var depth = 0; depth < this.maxDepth; depth++) {

            // Get legal plays
            var legal
            if (node !== undefined && !node.fullyExpanded()) {
                legal = node.unexpandedPlays
            }
            else
                legal = this.board.legal_plays(state)
            // console.log('state : ' + state.hash)
            // console.log('legal : ' + legal)
            
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
            else if (legal.length !== 0) {
                // console.log('random')
                play = legal[Math.floor(Math.random() * legal.length)]
            }
            else // No legal moves
                break

            // console.log('chosen play : ' + play)

            // Advance the state and node
            var newState = this.board.next_state(state, play)
            var newNode = this.nodes.get(newState.hash)

            // console.log('at : ' + state.hash)

            // Expand the first unexpanded state this simulation run
            if (expand && newNode === undefined) {
                expand = false

                // console.log('expanding : ' + newState.hash)

                // Make new Node
                newNode = new StatNode()
                newNode.unexpandedPlays = this.board.legal_plays(newState)
                newNode.parent = node

                // Update parent Node
                node.children.add(newNode)
                var index = node.unexpandedPlays.indexOf(play)
                node.unexpandedPlays.splice(index, 1)

                // Update Node map
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
                if (state.currentPlayer === -winner) { // Gotta flip it
                    node.wins++
                }
            }
        }
        else {
            console.log('max depth reached OR no legal moves')
            // TODO: figure out what to do when no winner
        }
    }
}

module.exports = MonteCarlo
