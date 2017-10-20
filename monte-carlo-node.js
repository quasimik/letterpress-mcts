'use strict'

/**
 * Class representing a node in the search tree.
 * Stores UCB1 wins/simulations stats.
 */
class MonteCarloNode {
    /**
     * Create a new MonteCarloNode in the search tree.
     * @param {MonteCarloNode} parent - The parent node.
     * @param {number[]} unexpandedPlays - An array of unexpanded play indexes.
     */
    constructor(parent, unexpandedPlays) {

        // Monte Carlo stuff
        this.plays = 0
        this.wins = 0

        // Tree stuff
        this.parent = parent // Parent MonteCarloNode
        this.unexpandedPlays = unexpandedPlays // Plays without nodes
        this.children = [ ] // Play index => Child MonteCarloNode ; discontinuous array
    }

    /**
     * Get the MonteCarloNode corresponding to the given play.
     * @param {number} play - The play index to find the child node of.
     * @return {MonteCarloNode} The child node corresponding to the play index given.
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
     * Expand a child play.
     * Add the node to the array of children nodes.
     * Remove the play from the array of unexpanded plays.
     * @param {number} playIndex - The play index of the play to expand.
     * @param {MonteCarloNode} childNode - The child node.
     */
    expand(playIndex, childNode) {
        this.children[playIndex] = childNode
        var index = this.unexpandedPlays.indexOf(playIndex)
        this.unexpandedPlays.splice(index, 1)
    }

    /**
     * @return {boolean} Whether all the children plays have expanded nodes
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
        return (this.wins / this.plays) + Math.sqrt(biasParam * Math.log(this.parent.plays) / this.plays);
    }
}

module.exports = MonteCarloNode
