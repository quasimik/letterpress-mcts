class StatNode {
    constructor() {
        /* This stores stats
        */
        this.plays = 0
        this.wins = 0

        // Children are StatNode objects
        this.totalChildren = null
        this.children = new Set()

        this.parent = null
    }

    // addChild(node) {
    //     this.children.add(node)
    // }

    fullyExpanded() {
        if (this.children.size === this.totalChildren)
            return true
        return false
    }

    getUCB1(biasParam) {
        var bias = biasParam || 2;
        // process.stdout.write(wins + " " + plays + " " + bias + " " + this.parent.visits + " " + plays + "\n");
        return (this.wins / this.plays) + Math.sqrt(bias * Math.log(this.parent.plays) / this.plays);
    }
}

module.exports = StatNode
