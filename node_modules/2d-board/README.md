# 2d-board
Simple array wrapper for 2-dimensional grid-based games

## Usage

### Basic Usage

```javascript
// Get and set cells
var cell = [ x, y ];
board.val(cell);
board.val(cell, val);

// Set out-of-bounds behavior for step functions
board.setoob("OOB_NEXT");

// Step through cells
var next = board.right(cell);
```

### Advanced Usage

```javascript
// Get and set cols and rows
board.col(x);
board.col(x, vals);
board.row(y);
board.row(y, vals);

// Get and set entire board
board.cols(x);
board.cols(x, vals);
board.rows(y);
board.rows(y, vals);

// Merge boards
board1.cols(board2.cols());
```

## Documentation

### Create a new 3 * 2 board:

```javascript
var createBoard = require("2d-board");
var board = createBoard(3, 2);
```

### Cell Operations

```javascript
var cell = [ 0, 0 ];
board.val(cell, 'X'); // Set cell at (0, 0) to 'X'
var val = board.val(cell); // Get cell at (0, 0)
console.log(val); // 'X'
```

### Step Functions

Given the board:

```
A B C
D E F
G H I
```

Step across cols and rows:

```javascript
var cell = [ 1, 1 ]; // 'E'
var next = board.up(cell); // 'E' -> 'B'
if (next !== null) cell = next; // Check for OOB
else { /* Handle it */ }
```

Step functions are `up`, `down`, `left`, `right`, and they return `null` if out of bounds.

You can set the oob flag to define out-of-bounds behavior:

```javascript
// A B C
// D E F
// G H I

board.setoob("OOB_SAME");
var cell = [ 3, 0 ]; // 'F'
var next = board.right(cell); // 'F' -> 'D'

board.setoob("OOB_NEXT");
var cell = [ 2, 0 ]; // 'F'
var next = board.right(cell); // 'F' -> 'G'
```

The available options are:

* `"OOB_NULL"` to return null on oob (default)
* `"OOB_STICK"` to return the same coordinates on oob
* `"OOB_SAME"` to wrap to the same row or col on oob
* `"OOB_NEXT"` to wrap to the next row or col on oob

### Row and Column Operations

To set an entire row or column:

```javascript
var row0 = [ 0, 1, 2 ];
var row1 = [ 3, 4, 5 ];
var col1 = [ 'A', 'B' ];
board.row(0, row0);
board.row(1, row1);
board.col(1, col1);
```

This yields the board:

```
0 A 2
3 B 5
```

To get an entire row or col:

```javascript
var row = board.row(0);
var col = board.col(2);
console.log(row); // [ 0, 'A', 2 ]
console.log(col); // [ 2, 5 ]
```

### Board Operations

To set the entire board:

```javascript
var vals = [
  [ 0, 1, 2 ],
  [ 3, 4, 5 ]
];
board.rows(vals); // Fill the board in rows

var vals = [
  [ 0, 3 ],
  [ 1, 4 ],
  [ 2, 5 ]
];
board.cols(vals); // Fill the board in cols
```

The two operations above yield the same board:

```
0 1 2
3 4 5
```

To get the entire board:

```javascript
var rows = board.rows(); // Retrieve all rows
var cols = board.cols(); // Retrieve all cols
console.log(rows); // [[ 0, 1, 2 ], [ 3, 4, 5 ]]
console.log(cols); // [[ 0, 3 ], [ 1, 4 ], [ 2, 5 ]]
```

## Features & Notes

* Permissive set methods. Handles any given array up to capacity, ignoring the rest.

```javascript
var board = createNewBoard(3, 1);
board.row(0, [ 0, 1, 2, 3, 4 ]);

// Yields the board:
// 0 1 2
// 3 and 4 are ignored.
```

* Undefined values are skipped.

```javascript
// A B C
// D E F
// G H I

board.row(1, [ '#', , '#' ]);

// Yields the board:
// A B C
// # E #
// G H I
```

* As usual, array contents can be objects. Types can be mixed.

```javascript
var item = { 'number': 4, 'elements': [ 123, 'abc' ] };
var row = [ 789, item, 'xyz' ];
var board = createNewBoard(3, 1);
board.row(0, row);
```

* Due to the internal representation of the array, references to rows are more efficient than references to cols.

```javascript
// Assume a board with equal rows and cols, and homogeneous elements

// This is more efficient
var row = board.row(0);

// This is less efficient
var col = board.col(0);
```

## Future Developments

* Custom comparator function for board merging
* Hashmap for board representation, instead of using array
