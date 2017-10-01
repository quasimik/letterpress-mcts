'use strict'

const Node = require('./stat-node.js')

class MonteCarlo {

    constructor(board, maxDepth) {
        this.board = board
        this.maxDepth = maxDepth || Infinity
        this.state = null // Current state node

        this.nodes = new Map()
    }

    update(state) {
        /* Update state which we want to find the best play for
        */

        this.state = state
        // if (!this.nodes.has(state)) {
        //     var node = new StatNode(state, null)
        //     node.legalPlays = this.board.legal_plays(state)
        //     this.nodes.set(state, node)
        // }
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
        return
    }

    run_simulation() {
        /* Play one random game to completion from current state,
        ** then update statistics table.
        */

        var state = this.state // No need to copy because we do not modify it
        var winner = null

        // Run simulation
        var expand = true // Expand once per simulation
        for (var depth = 0; depth < this.maxDepth; depth++) {
            // var node = this.nodes.get(state)


            // Get legal plays
            // var legal
            // if (node !== undefined) {
            //     legal = node.legalPlays
            //     console.log('cached')
            // }
            // else {
            //     console.log('generate')
            //     legal = this.board.legal_plays(state)
            // }
            var legal = this.board.legal_plays(state)
            console.log('state: ' + state.hash)
            console.log('legal: ' + legal)

            if (legal.length === 0)
                break

            // Choose a play
            // if (node !== undefined && node.fullyExpanded()) {
            //     // Choose using UCB1
            //     var play = choose()
            // }
            // else {
            //     // Choose random
            //     var play = legal[Math.floor(Math.random() * legal.length)]
            // }
            var play = legal[Math.floor(Math.random() * legal.length)]

            // Advance the state and node
            // var cachedState
            // if (node !== undefined)
            //     cachedState = node.nextState(play) // Might be null if not cached
            // state = cachedState || this.board.next_state(state, play)
            // var newNode = this.nodes.get(state)
            var newState = this.board.next_state(state, play)

            // console.log('at ' + state.hash)

            if (expand && this.nodes.get(newState) === undefined) {
                let node = new StatNode()
                this.nodes.get(state).children.add(node)
                this.nodes.set(newState, node)
            }

            // Expand once for this simulation run
            // if (expand && !newNode) {
            //     // console.log('expand ' + state.hash)
            //     expand = false

            //     var childNode = new StatNode(state, node)
            //     childNode.legalPlays = this.board.legal_plays(state)
            //     this.nodes.set(state, childNode)
            // }
            // node = newNode
            // if (node !== undefined) {
            //     leafNode = node
            //     console.log(leafNode)
            // }

            winner = this.board.winner(state)
            if (winner !== 0) break
        }

        // Backpropagate
        if (winner !== 0)
            leafNode.backpropagate(winner)

        // Debug
        // for (var [state, node] of this.nodes) {
        //     console.log('---STATS')
        //     console.log(state.hash + ' : ' + node.numWins + '/' + node.numPlays)
        // }

        // // Backpropagate
        // for (var hash of visitedStates) {
        //     if (!this.plays.has(hash))
        //         continue

        //     this.plays.set(hash, this.plays.get(hash) + 1)

        //     var player = hash[hash.length - 2]
        //     player = (player === '-') ? -1 : 1
        //     if (player !== winner) // Need to flip it
        //         this.wins.set(hash, this.wins.get(hash) + 1)
        // }
    }

    static getUCB1(totalPlays, plays, wins, biasParam) {
        var bias = biasParam || 2;
        // process.stdout.write(wins + " " + plays + " " + bias + " " + this.parent.visits + " " + plays + "\n");
        return (wins / plays) + Math.sqrt(bias * Math.log(totalPlays) / plays);
    }
}

module.exports = MonteCarlo
