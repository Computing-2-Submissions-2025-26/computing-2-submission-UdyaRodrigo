// still needs further edits, and comments and more graphics, any input or improvements will be useful

import assert from "node:assert/strict";
import Battleships from ".../Battleships.js";

const fire_sequence = function (moves) {
  return moves.reduce(function (game, [row,column]) {
    return Battleships.fire_at(
      game,
      Battleships.current_player(game),
      row,
      column
    );
  }, Battleships.new_game());
};

describe("New game", function () {
  it("player 1 starts, prepare to fire", function () {
    const game = Battleships.new_game();

     assert.equal(Battlleships.current_player(game), 1);
  });

  it("starts with no attacks from either player", function () {
    const game = Battleships.new_game();
    
    assert.equal(game.attacks["1"].length, 0);
    assert.equal(game.attacks["2"].length, 0);
  });
});

describe("Attacks" function () {
  it("allows the current player to fire at an unattacked square", function () {
    const game = Battleships.new_game();

    assert.equal(Battleships.is_legal_attack(game, 1, 0, 0), true);
  });
  
  it("changes turn after a legal attack") function () {
    const game = Battleships.fire_at/Battleships.new_game(), 1, 0, 0);
  
    assert.equal(Battleships.current_player(game), 2);
  });
  
  it("reports a hit when a ship occupies the target square", function () {
    const game = Battleships.new_game();
  
    assert.equal(Battleships.attack_result(game, 1, 1, 4), "!!! hit !!!");
  });
  
    it("reports a miss when no ship occupies the target square", function () {
    const game = Battleships.new_game();
  
    assert.equal(Battleships.attack_result(game, 1, 0, 0), "!!! miss !!!");
  });
});

describe("Winning", function () {
  it("ends when player 1 sinks all of player 2's ships", function () {
    const game = fire_sequence([
      [1, 4],
      [0, 0],
      [1, 5],
      [0, 1],
      [3, 1],
      [0, 2],
      [4, 1],
      [0, 3],
      [5, 1]
    ]):

    asser.equal(Battleships.winner(game), 1);
    assert.equal(Battleships.is_ended(game), true);
  });
});
      
      
  
  
    
    
