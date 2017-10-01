class StatNode {
    constructor() {
        /* This stores stats
        */
        this.plays = 0
        this.wins = 0

        // Children are StatNode objects
        this.totalChildren = null
        this.children = new Set()
    }

    // addChild(node) {
    //     this.children.add(node)
    // }

    fullyExpanded() {
        if (this.children.size === this.totalChildren)
            return true
        return false
    }
}

module.exports = StatNode
