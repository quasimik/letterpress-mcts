class StatNode {
    constructor(state, parent) {
        /* This memoizes the generation of states from plays
        */
        this.state = state || null
        this.legalPlays = null
        
        this.parent = parent || null
        this.children = new Map()

        this.numPlays = 0
        this.numWins = 0
    }

    get legalPlays() {
        return this.legalPlays
    }

    set legalPlays(legalPlays) {
        this.legalPlays = legalPlays
    }

    incrementPlays() {
        this.numPlays++
    }

    incrementWins() {
        this.numWins++
    }

    legalPlays() {
        return legalPlays
    }

    addChild(play, state) {
        var childTree = new StatNode(state, this)
        this.children.set(play, childTree)
    }

    fullyExpanded() {
        if (this.children.size === this.totalChildren)
            return true
        return false
    }

    nextState(play) {
        var childTree = this.children.get(play)
        if (childTree !== undefined)
            return childTree.state
        return null
    }

    backpropagate(winner) {
        if (this.state.currentPlayer !== winner) // Gotta flip it
            this.numWins++
        if (parent !== null)
            parent.backpropagate(winner)
    }
}

module.exports = StatNode
