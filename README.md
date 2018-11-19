# letterpress-mcts
An application of Monte-Carlo Tree Search in the game of Letterpress.  
[Blog post here](https://medium.com/@quasimik/monte-carlo-tree-search-applied-to-letterpress-34f41c86e238)

## Instructions
1. Clone
2. Run `npm install` to ensure Node.js module dependencies are installed
3. Run `npm start` to run the MCTS algorithm on a 3\*3 letterpress board for 5 seconds

## Structure
```
           - index.js -
          /            \
       Board          MonteCarlo
     /       \                \
  State     WordPlayMap     MonteCarloNode
             /
           Play
```

## High-level Description

### index.js
* Top-level module
* Ask Board for a game representation (an instance of Board)
* Pass game representation to MonteCarlo
* Ask MonteCarlo to run game simulations for `n` seconds

### Board
* The representation of the game
* Construct starting game state
* Return all legal plays from current state
* Given a play, apply it to the current state, advancing it
* Return the winner of the game at the current state

### State
* The representation of a game state
* Track board ownership, played words, current player, and legal plays
* Return the state's current score
* Return the state's legal plays
* Return a unique hash of this state
* Remove legal plays from this state

### WordPlayMap
* A heavy-duty class performing efficient Letterpress-specific Play generation and indexing
* In general, a word is associated with multiple Plays, corresponding to different combinations of tiles on the game board
* Given a dictionary and array of letters, generate all possible words from all combinations of board tiles for that word
* To improve memory use, index and store the full Play objects privately while only exposing their indices publicly
* Return indices of all possible Plays
* Given a play index, return the associated Play
* Given a word, return all play indices for that word
* Given a word, return all play indices for that word and all of its prefixes

### Play
* The representation of a game move
* Track a specific word and a specific combination of board tiles that forms that word
* Return a unique hash of this play

### MonteCarlo
* The representation of a Monte Carlo search tree
* Given a timeout of `n` seconds, perform Monte Carlo simulations to get better move estimates within that time

### MonteCarloNode
* The representation of a Monte Carlo node
* Given a Play index, return the child MonteCarloNode associated with that Play
* Given a Play index and a MonteCarloNode, expand this node with the given Play and node
* Return whether all children plays have been expanded
* Given a bias, return the UCB1 value of this node

## Documentation

This project uses [JSDoc 3](http://usejsdoc.org/index.html) to automatically generate .html docs from in-code documentation.

1. Run `npm run jsdoc` (make sure you've done `npm install`)
2. Open `./docs/index.html` in a browser
