'use strict'

/**
 * Class representing a node in the search tree.
 * Stores UCB1 wins/simulations stats.
 */
class MonteCarloNode {
    /**
     * Create a new MonteCarloNode in the search tree.
     * @param {MonteCarloNode} parent - The parent node.
     */
    constructor(parent) {

        // Monte Carlo stuff
        this.plays = 0
        this.wins = 0
        this.unexpandedPlays = null // Plays without Monte Carlo stats

        // Tree stuff
        this.parent = parent // MonteCarloNode object
        this.children = [ ] // Play => MonteCarloNode
    }

    /**
     * Get the MonteCarloNode corresponding to the given move.
     * @param {number} play - The move index to find the child node of.
     * @return {MonteCarloNode} The child node corresponding to the move index given.
     */
    nextNode(play) {
        var node = this.children[play]
        if (node !== undefined) {
            return node
        }
        else {
            throw new Error('No such Play memoized!')
            // return null // No such memoized state
        }
    }

    /**
     * @return {boolean} Whether all the children moves have expanded nodes
     */
    fullyExpanded() {
        if (this.unexpandedPlays !== null && this.unexpandedPlays.length === 0)
            return true
        else
            return false
    }
    
    /**
     * Get the UCB1 value for this node.
     * @param {number} biasParam - The square of the bias parameter in the UCB1 algorithm, defaults to 2.
     * @return {number} The UCB1 value of this node.
     */
    getUCB1(biasParam) {
        var bias = biasParam || 2;
        // process.stdout.write(wins + " " + plays + " " + bias + " " + this.parent.visits + " " + plays + "\n");
        return (this.wins / this.plays) + Math.sqrt(bias * Math.log(this.parent.plays) / this.plays);
    }
}

module.exports = MonteCarloNode
