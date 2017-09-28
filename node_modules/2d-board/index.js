(function() {
  "use strict";
  
  const OOB_NULL = 0;
  const OOB_STICK = 1;
  const OOB_SAME = 2;
  const OOB_NEXT = 3;
  // const OOB_PREV = 4;
  
  // Test for natural numbers including 0
  function validNatural(val) {
    if (typeof val !== "number" || val < 0 || val !== val) {
      return false;
    }
    return true;
  }
  
  function validCell(cell) {
    if (!Array.isArray(cell) || cell.length !== 2) {
      return false;
    }
    if (!validNatural(cell[0]) || !validNatural(cell[1])) {
      return false;
    }
    return true;
  }
  
  // Test for index within board bounds
  // Assume cell is valid
  function validBounds(board, cell) {
    if (cell[0] >= board.numCols || cell[1] >= board.numRows) {
      return false;
    }
    return true;
  }
  
  function Board(numCols, numRows) {
    if (!validNatural(numCols) || !validNatural(numRows)) {
      throw new TypeError("2d-board: arguments must be numbers.");
    }
    
    this.numCols = numCols;
    this.numRows = numRows;
    this.oob = OOB_NULL;
    
    this.vals = new Array(numRows);
    for (var i = 0; i < this.numRows; i++) {
      this.vals[i] = new Array(numCols);
    }
    return this;
  }
  
  // Val getter and setter
  Board.prototype.val = function(cell, val) {
    
    if (arguments.length != 1 && arguments.length != 2)
      throw new Error("2d-board::val(): incorrect number of arguments.");
    
    if (!validCell(cell))
      throw new TypeError("2d-board::val(): first argument is not a valid cell.");
    
    if (!validBounds(this, cell))
      throw new RangeError("2d-board::val(): cell is out of bounds.");
    
    // 1 arg: get val at x=col, y=row
    if (arguments.length == 1) {
      return this.vals[cell[1]][cell[0]];
    }
    
    // 2 args: set val at [row][col]
    this.vals[cell[1]][cell[0]] = val;
    return this;
  };
  
  // Out-of-bounds behavior setting
  Board.prototype.setoob = function(behavior) {
    if (typeof behavior !== "string")
      throw new TypeError("2d-board::oob(): argument is not a valid string.");
    switch (behavior) {
      case "OOB_NULL":
      this.oob = OOB_NULL;
      break;
      
      case "OOB_STICK":
      this.oob = OOB_STICK;
      break;
      
      case "OOB_SAME":
      this.oob = OOB_SAME;
      break;
      
      case "OOB_NEXT":
      this.oob = OOB_NEXT;
      break;
      
      // case "OOB_PREV":
      // this.oob = OOB_PREV;
      // break;
      
      default:
      throw new Error("2d-board::oob(): argument is not a valid OOB flag.");
    }
    return this.oob;
  };
  
  // Step functions
  Board.prototype.up = function(cell) {
    if (!validCell(cell))
      throw new TypeError("2d-board::up(): argument is not a valid cell.");
    
    if (!validBounds(this, cell))
      throw new RangeError("2d-board::up(): cell is out of bounds.");
    
    if (cell[1] - 1 >= 0) {
      return [cell[0], cell[1] - 1];
    }
    
    switch(this.oob) {
      case OOB_NULL:
      return null;
      
      case OOB_STICK:
      return cell;
      
      case OOB_SAME:
      return [cell[0], this.numRows - 1];
      
      case OOB_NEXT:
      if (cell[0] !== 0)
        return [cell[0] - 1, this.numRows - 1];
      else
        return [this.numCols - 1, this.numRows - 1];
      
      // case OOB_PREV:
    }
  };
  
  Board.prototype.down = function(cell) {
    if (!validCell(cell))
      throw new TypeError("2d-board::down(): argument is not a valid cell.");
    
    if (!validBounds(this, cell))
      throw new RangeError("2d-board::down(): cell is out of bounds.");
    
    if (cell[1] + 1 < this.numRows) {
      return [cell[0], cell[1] + 1];
    }
    
    switch(this.oob) {
      case OOB_NULL:
      return null;
      
      case OOB_STICK:
      return cell;
      
      case OOB_SAME:
      return [cell[0], 0];
      
      case OOB_NEXT:
      if (cell[0] !== this.numCols - 1)
        return [cell[0] + 1, 0];
      else
        return [0, 0];
      
      // case OOB_PREV:
    }
  };
  
  Board.prototype.left = function(cell) {
    if (!validCell(cell))
      throw new TypeError("2d-board::left(): argument is not a valid cell.");
    
    if (!validBounds(this, cell))
      throw new RangeError("2d-board::left(): cell is out of bounds.");
    
    if (cell[0] - 1 >= 0) {
      return [cell[0] - 1, cell[1]];
    }
    
    switch(this.oob) {
      case OOB_NULL:
      return null;
      
      case OOB_STICK:
      return cell;
      
      case OOB_SAME:
      return [this.numCols - 1, cell[1]];
      
      case OOB_NEXT:
      if (cell[1] !== 0)
        return [this.numCols - 1, cell[1] - 1];
      else
        return [this.numCols - 1, this.numRows - 1];
      
      // case OOB_PREV:
    }
  };
  
  Board.prototype.right = function(cell) {
    if (!validCell(cell))
      throw new TypeError("2d-board::right(): argument is not a valid cell.");
    
    if (!validBounds(this, cell))
      throw new RangeError("2d-board::right(): cell is out of bounds.");
    
    if (cell[0] + 1 < this.numCols) {
      return [cell[0] + 1, cell[1]];
    }
    
    switch(this.oob) {
      case OOB_NULL:
      return null;
      
      case OOB_STICK:
      return cell;
      
      case OOB_SAME:
      return [0, cell[1]];
      
      case OOB_NEXT:
      if (cell[1] !== this.numRows - 1)
        return [0, cell[1] + 1];
      else
        return [0, 0];
      
      // case OOB_PREV:
    }
  };
  
  // Row array getter and setter
  Board.prototype.row = function(row, vals) {
    
    if (arguments.length != 1 && arguments.length != 2)
      throw new Error("2d-board::row(): incorrect number of arguments.");
    
    if (!validNatural(row))
      throw new TypeError("2d-board::row(): first argument is not a number.");
    
    if (!validBounds(this, [0, row]))
      throw new RangeError("2d-board::row(): row is out of bounds.");
    
    // 2 args: set row at row
    if (arguments.length == 2) {
      
      if (!Array.isArray(vals))
        throw new TypeError("2d-board::row(): second argument is not an array.");
    
      for (var i = 0; i < vals.length; i++) {
        
        // Permissive set, will fill up to capacity and ignore the rest
        if (i >= this.numCols)
          break;
        
        if (vals[i] === undefined)
          continue;
        
        this.vals[row][i] = vals[i];
      }
    }
    return this.vals[row];
  }
  
  // Col array getter and setter
  Board.prototype.col = function(col, vals) {
    
    if (arguments.length != 1 && arguments.length != 2)
      throw new Error("2d-board::col(): incorrect number of arguments.");
    
    if (!validNatural(col))
      throw new TypeError("2d-board::col(): first argument is not a number.");
    
    if (!validBounds(this, [col, 0]))
      throw new RangeError("2d-board::col(): column is out of bounds.");
    
    // 2 args: set column at col
    if (arguments.length == 2) {
      
      if (!Array.isArray(vals))
        throw new TypeError("2d-board::col(): second argument is not an array.");
      
      for (var i = 0; i < vals.length; i++) {
        
        // Permissive set, will fill up to capacity and ignore the rest
        if (i >= this.numRows)
          break;
        
        if (vals[i] === undefined)
          continue;
        
        this.vals[i][col] = vals[i];
      }
    }
    
    var colArr = new Array(this.numRows);
    for (var i = 0; i < this.numRows; i++) {
      
      if (this.vals[i][col] === undefined)
        continue;
      
      colArr[i] = this.vals[i][col];
    }
    return colArr;
  }
  
  Board.prototype.rows = function(vals) {
    
    if (arguments.length > 1)
      throw new Error("2d-board::rows(): incorrect number of arguments.");
    
    // 1 arg: set rows
    if (arguments.length == 1) {
      
      if (!Array.isArray(vals))
        throw new TypeError("2d-board::rows(): argument is not an array.");
      
      for (var row_i = 0; row_i < vals.length; row_i++) {
        
        // Permissive set, will fill up to capacity and ignore the rest
        if (row_i >= this.numRows)
          break;
        
        if (!Array.isArray(vals[row_i]))
          throw new TypeError("2d-board::rows(): not all the elements in the argument are arrays.");
        
        this.row(row_i, vals[row_i]);
      }
    }
    
    return this.vals;
  }
  
  Board.prototype.cols = function(vals) {
    
    if (arguments.length > 1)
      throw new Error("2d-board::cols(): incorrect number of arguments.");
    
    // 1 arg: set cols
    if (arguments.length == 1) {
      
      if (!Array.isArray(vals))
        throw new TypeError("2d-board::cols(): argument is not an array.");
      
      for (var col_i = 0; col_i < vals.length; col_i++) {
        
        // Permissive set, will fill up to capacity and ignore the rest
        if (col_i >= this.numCols)
          break;
        
        if (!Array.isArray(vals[col_i]))
          throw new TypeError("2d-board::cols(): not all the elements in the argument are arrays.");
        
        this.col(col_i, vals[col_i]);
      }
    }
    
    var colsArr = new Array(this.numCols);
    for (var i = 0; i < this.numCols; i++) {
      colsArr[i] = this.col(i);
    }
    return colsArr;
  }
  
  module.exports = function createBoard(x, y) {
    if (arguments.length != 2) {
      throw new Error("2d-board: Must supply two numbers as arguments.");
    }
    return new Board(x, y);
  }
  
})();