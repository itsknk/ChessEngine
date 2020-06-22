//RANDOM
var randomMove = function() {
  var possibleMoves = game.moves();
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};

//EVALUATE AND CALCULATE
var evaluateBoard = function(board, color) {
  // set value for each piece
  var pieceValue = {
    'p': 100,
    'n': 350,
    'b': 350,
    'r': 525,
    'q': 1000,
    'k': 10000
  };

  // Loop through each piece and sum
  var value = 0;
  board.forEach(function(row) {
    row.forEach(function(piece) {
      if (piece) {
        // if it's opponents piece then subtract
        value += pieceValue[piece['type']]
                 * (piece['color'] === color ? 1 : -1);
      }
    });
  });

  return value;
};

//Calulates one move ahead
var calcBestMoveOne = function(playerColor) {

  var possibleMoves = game.moves();//all possible moves
  //Sort the moves as same won't be picked each time
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});

  // If game done, then exit
  if (game.game_over() === true || possibleMoves.length === 0) return;

  // search the move with highest value
  var bestMoveSoFar = null;
  var bestMoveValue = Number.NEGATIVE_INFINITY;
  possibleMoves.forEach(function(move) {
    game.move(move);
    var moveValue = evaluateBoard(game.board(), playerColor);
    if (moveValue > bestMoveValue) {
      bestMoveSoFar = move;
      bestMoveValue = moveValue;
    }
    game.undo();
  });

  return bestMoveSoFar;
}

//MINIMAX
var calcBestMoveNoAB = function(depth, game, playerColor,
                                isMaximizingPlayer=true) {
  // If already at base, return
  if (depth === 0) {
    value = evaluateBoard(game.board(), playerColor);
    return [value, null]
  }

  // BestMove can be obtained via recursion
  var bestMove = null;
  var possibleMoves = game.moves(); //all possiblr moves
  // Sort so that same won't be picked each time
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    game.move(move); //make move
    // Recursively get the values
    value = calcBestMoveNoAB(depth-1, game, playerColor, !isMaximizingPlayer)[0];
    console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
                bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
    }
    game.undo();
  }
  console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue);
  // Return the best move, or the only move
  return [bestMoveValue, bestMove || possibleMoves[0]];
}

//MINIMAX ALPHA BETA PRUNING
var calcBestMove = function(depth, game, playerColor, alpha=Number.NEGATIVE_INFINITY,beta=Number.POSITIVE_INFINITY,isMaximizingPlayer=true) {
  //If already at the base, return the evaluated
  if (depth === 0) {
    value = evaluateBoard(game.board(), playerColor);
    return [value, null]
  }

  // possible moves can be obtained recursively
  var bestMove = null; 
  var possibleMoves = game.moves(); //all possible moves
  // Sort so that same won't be picked each time
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    game.move(move);
    //value can be obtained recursively
    value = calcBestMove(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];
    console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
                bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }
    game.undo();
    // Check for alpha beta pruning
    if (beta <= alpha) {
      console.log('Prune', alpha, beta);
      break;
    }
  }
  console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
  // Return the best move, or the only move
  return [bestMoveValue, bestMove || possibleMoves[0]];
}