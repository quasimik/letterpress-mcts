'use strict'

class StatNode {
    constructor() {
        /* This stores stats
        */
        this.plays = 0
        this.wins = 0

        this.unexpandedPlays = null // Expands into children
        this.children = new Set() // Children are StatNode objects

        this.parent = null
    }

    // addChild(node) {
    //     this.children.add(node)
    // }

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

module.exports = StatNode
