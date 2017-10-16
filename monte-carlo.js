'use strict'

const MonteCarloNode = require('./monte-carlo-node.js')

/**
 * Class representing the Monte Carlo search tree.
 * Takes care of generating and storing the search tree.
 * Takes care of running simulations and calculating the best move.
 */
class MonteCarlo {
    /**
     * Create a Monte Carlo search tree.
     * @param {Board} board - The game board to query regarding legal moves and state advancement.
     * @param {number} maxDepth - The maximum search depth of all simulations run.
     * @param {number} UCB1ExploreParam - The square of the bias parameter in the UCB1 algorithm, defaults to 2.
     */
    constructor(board, maxDepth, UCB1ExploreParam) {
        this.board = board
        this.maxDepth = maxDepth || Infinity
        this.UCB1ExploreParam = UCB1ExploreParam || 2

        this.state = null // Current state node

        this.nodes = new Map() // Map: State.hash => MonteCarloNode
        // Add: Map state + play hashes to states? i.e. nextState cache?

        // Informative/debug
        this.deeps = 0
    }

    /**
     * Update the state to find the best move for.
     * @param {State} state - The state to find the best move for; its parent is set to null.
     */
    update(state) {

        this.state = state
        if (!this.nodes.has(state)) {
            var unexpandedPlays = state.legalPlays.slice()
            var node = new MonteCarloNode(null, unexpandedPlays)
            // console.log(node.unexpandedPlays)
            this.nodes.set(state.hash, node)
        }
    }

    /**
     * Run as many simulations as possible until the time limit.
     * From the available statistics, calculate the best move from the current state.
     * @param {number} timeout - The time to run the simulations for, in seconds.
     * @return {Play} The best play from the current state.
     */
    getPlay(timeout) {

        var sims = 0
        var totalSims = 0
        var earlyTerminations = 0
        var totalDeeps = 0
        var start = Date.now()
        var end = start + timeout * 1000
        var notify = 3

        // Run simulations
        while (Date.now() < end) {
            if (Date.now() > start + notify * 1000) { // Notify every 3 seconds
                console.log(   'secs ' +      notify + '/' + timeout + 
                            ' | sims '  +     sims + 
                            ' | sims/s ' +    (sims/3).toFixed(0) + 
                            ' | deeps/s ' +   (this.deeps/3).toFixed(0) +
                            ' | avg.depth ' + (this.deeps/sims).toFixed(1))

                totalSims += sims
                sims = 0

                totalDeeps += this.deeps
                this.deeps = 0

                notify += 3
            }

            var winner = this.runSimulation()

            // if (sims === 33)
            //     throw new Error('debug')
            
            if (winner === 0)
                earlyTerminations++
            sims++
        }

        console.log('time(s) ' + timeout + '/' + timeout + ' (FINISHED)')
        console.log('total sims : ' + totalSims)
        console.log('total rate(sims/s) : ' + (totalSims/timeout).toFixed(1))
        console.log('total avg. depth : ' + (totalDeeps/totalSims).toFixed(1))
        console.log('early terminations : ' + earlyTerminations) // Max depth reached OR no legal moves

        // Output statistics for depth=1 nodes
        // console.log('-----')
        // var depth1Nodes = this.nodes.get(this.state.hash).children
        // for (var [play, node] of depth1Nodes) {
        //     console.log(this.board.nextState(this.state, play).hash, ' : (', node.wins, '/', node.plays, ')')
        // }
        // console.log(this.state.hash, ' : (', this.nodes.get(this.state.hash).wins, '/', this.nodes.get(this.state.hash).plays, ')')

        // If not all children are expanded, no best play
        if (!this.nodes.get(this.state.hash).fullyExpanded())
            return null
        
        // Get best play (most plays)
        var legal = this.state.legalPlays
        var maxPlays = 0
        var bestPlay
        var node = this.nodes.get(this.state.hash)
        for (var i = 0; i < legal.length; i++) {
            var childNode = node.nextNode(legal[i])
            if (childNode.plays > maxPlays) {
                bestPlay = legal[i]
                maxPlays = childNode.plays
            }
        }
        return this.board.wpm.actualize(bestPlay)
    }

    /**
     * Simulate one game to completion from the current state.
     * Create one node in the search tree.
     * Update the visited nodes with new information from the simulation.
     */
    runSimulation() {

        // Initial values
        var state = this.state // No need to copy because we do not modify it
        var node = this.nodes.get(state.hash)
        var winner = null

        var visitedStates = new Set()
        visitedStates.add(state)

        // Run simulation
        var expand = true // Expand once per simulation
        for (var depth = 0; depth < this.maxDepth; depth++) {

            this.deeps++

            // Get legal plays
            var legal
            if (node !== undefined && !node.fullyExpanded()) {
                // console.log('get legal plays from unexpanded')
                legal = node.unexpandedPlays
            }
            else {
                // console.log('get legal plays from full list')
                legal = state.legalPlays
            }

            // console.log('state : ' + state.hash)
            // console.log('legal : ' + legal) // Warning: very verbose
            
            // Choose a play
            var play
            if (legal.length === 1) {
                // console.log('one')
                play = legal[0]
            }
            else if (node !== undefined && node.fullyExpanded()) {
                // console.log('stats')
                // console.log(node.unexpandedPlays)
                var maxUCB1 = 0
                for (var i = 0; i < legal.length; i++) {
                    var childUCB1 = node.nextNode(legal[i]).getUCB1(this.UCB1ExploreParam)
                    if (childUCB1 > maxUCB1) {
                        play = legal[i]
                        maxUCB1 = childUCB1
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
            var newState = this.board.nextState(state, play)
            var newNode = this.nodes.get(newState.hash)

            // console.log('at : ' + newState.hash)

            // Expand once this simulation run
            if (expand && newNode === undefined) {
                expand = false

                // console.log('expanding : ' + newState.hash)

                // Make new Node
                var unexpandedPlays = newState.legalPlays.slice()
                newNode = new MonteCarloNode(node, unexpandedPlays)

                // Update parent Node
                node.expand(play, newNode)

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
        for (var state of visitedStates) {
            /* Add statistics to all visited nodes
            ** If no winner, 'plays' count is still updated
            ** Not sure if this is the best approach.
            */

            var node = this.nodes.get(state.hash)
            node.plays++
            if (state.currentPlayer === -winner) { // Gotta flip it
                node.wins++
            }
        }
        if (winner === 0) {
            // console.log('max depth reached OR no legal moves')
        }
        return winner
    }
}

module.exports = MonteCarlo
