'use strict'

class MonteCarloNode {
    /* This stores stats
    ** This also memoizes next_state
    */

    constructor() {

        // Monte Carlo stuff
        this.plays = 0
        this.wins = 0
        this.unexpandedPlays = null // Plays without Monte Carlo stats

        // Tree stuff
        this.parent = null // MonteCarloNode object
        this.children = new Map() // Map: Play => MonteCarloNode
    }

    next_node(play) { // Memoized next_state
        var node = this.children.get(play)
        if (node !== undefined) {
            return node
        }
        else {
            throw new Error('No such Play memoized!')
            // return null // No such memoized state
        }
    }

    fullyExpanded() {
        if (this.unexpandedPlays !== null && this.unexpandedPlays.length === 0)
            return true
        else
            return false
    }

    getUCB1(biasParam) {
        var bias = biasParam || 2;
        // process.stdout.write(wins + " " + plays + " " + bias + " " + this.parent.visits + " " + plays + "\n");
        return (this.wins / this.plays) + Math.sqrt(bias * Math.log(this.parent.plays) / this.plays);
    }
}

module.exports = MonteCarloNode
