// Computer makes a move with algorithm choice and skill/depth level
var makeMove = function(algo, skill=4) {
  // exit if the game is over
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  // Calculate the best move, using chosen algorithm
  if (algo === 1) {
    var move = randomMove();
  } else if (algo === 2) {
    var move = calcBestMoveOne(game.turn());
  } else if (algo === 3) {
    var move = calcBestMoveNoAB(skill, game, game.turn())[1];
  } else {
    var move = calcBestMove(skill, game, game.turn())[1];
  }
  // Make the calculated move
  game.move(move);
  // Update board positions
  board.position(game.fen());
}

//As human makes the move, AI plays accordingly
var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' 
  });

  // If illegal move, snapback
  if (move === null) return 'snapback';

  // Log the move
  console.log(move)

  // make move for black
  window.setTimeout(function() {
    makeMove(4, 3);
  }, 250);
};
