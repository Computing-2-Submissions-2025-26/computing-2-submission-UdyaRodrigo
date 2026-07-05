/**
 * Pure game module for Battleships.
 *
 * This module represents the game state and provides operations for attacks,
 * hit detection, turn changes, sunk ships, and victory.
 *
 * @module Battleships
 */

import R from "./ramda.js";

const Battleships = Object.create(null);

const BOARD_SIZE = 6;
const PLAYER_ONE = 1;
const PLAYER_TWO = 2;

const DEFAULT_FLEETS = Object.freeze({
  "1": [
    {"name": "Destroyer", "cells": [[0, 0], [0, 1]]},
    {"name": "Cruiser", "cells": [[2, 3], [3, 3], [4, 3]]}
  ],
  "2": [
    {"name": "Destroyer", "cells": [[1, 4], [1, 5]]},
    {"name": "Cruiser", "cells": [[3, 1], [4, 1], [5, 1]]}
  ]
});

const same_cell = function (first, second) {
  return first[0] === second[0] && first[1] === second[1];
};

const copy_fleet = function (fleet) {
  return R.map(function (ship) {
    return {
      "name": ship.name,
      "cells": R.map(function (cell) {
        return cell.slice();
      }, ship.cells)
    };
  }, fleet);
};

const copy_attacks = function (attacks) {
  return {
    "1": R.map(function (attack) {
      return attack.slice();
    }, attacks["1"]),
    "2": R.map(function (attack) {
      return attack.slice();
    }, attacks["2"])
  };
};

const all_ship_cells = function (fleet) {
  return R.chain(function (ship) {
    return ship.cells;
  }, fleet);
};

/**
 * Create a new Battleships game.
 *
 * @returns {object} A new game state.
 */
Battleships.new_game = function () {
  return {
    "fleets": {
      "1": copy_fleet(DEFAULT_FLEETS["1"]),
      "2": copy_fleet(DEFAULT_FLEETS["2"])
    },
    "attacks": {
      "1": [],
      "2": []
    },
    "next_player": PLAYER_ONE
  };
};

/**
 * Get the board size.
 *
 * @returns {number} The board width and height.
 */
Battleships.board_size = function () {
  return BOARD_SIZE;
};

/**
 * Get the opponent of a player.
 *
 * @param {number} player Current player.
 * @returns {number} Opponent player.
 */
Battleships.opponent = function (player) {
  return player === PLAYER_ONE
    ? PLAYER_TWO
    : PLAYER_ONE;
};

/**
 * Get the current player.
 *
 * @param {object} game Current game state.
 * @returns {number} Current player.
 */
Battleships.current_player = function (game) {
  return game.next_player;
};

/**
 * Check whether a coordinate is on the board.
 *
 * @param {number} row Row index.
 * @param {number} column Column index.
 * @returns {boolean} True if the coordinate is valid.
 */
Battleships.is_on_board = function (row, column) {
  return row >= 0 &&
    row < BOARD_SIZE &&
    column >= 0 &&
    column < BOARD_SIZE;
};

/**
 * Check whether a player has already attacked a square.
 *
 * @param {object} game Current game state.
 * @param {number} player Attacking player.
 * @param {number} row Row index.
 * @param {number} column Column index.
 * @returns {boolean} True if the square has already been attacked.
 */
Battleships.has_attacked = function (game, player, row, column) {
  return R.any(function (attack) {
    return same_cell(attack, [row, column]);
  }, game.attacks[String(player)]);
};

/**
 * Check whether an attack is legal.
 *
 * @param {object} game Current game state.
 * @param {number} player Attacking player.
 * @param {number} row Row index.
 * @param {number} column Column index.
 * @returns {boolean} True if the attack is legal.
 */
Battleships.is_legal_attack = function (game, player, row, column) {
  return Battleships.is_on_board(row, column) &&
    player === Battleships.current_player(game) &&
    !Battleships.has_attacked(game, player, row, column) &&
    !Battleships.is_ended(game);
};

/**
 * Return whether an attack is a hit or a miss.
 *
 * @param {object} game Current game state.
 * @param {number} player Attacking player.
 * @param {number} row Row index.
 * @param {number} column Column index.
 * @returns {string} Either "hit" or "miss".
 */
Battleships.attack_result = function (game, player, row, column) {
  const defender = Battleships.opponent(player);
  const target_cells = all_ship_cells(game.fleets[String(defender)]);

  return R.any(function (cell) {
    return same_cell(cell, [row, column]);
  }, target_cells)
    ? "hit"
    : "miss";
};

/**
 * Fire at a square and return the next game state.
 *
 * @param {object} game Current game state.
 * @param {number} player Attacking player.
 * @param {number} row Row index.
 * @param {number} column Column index.
 * @throws {Error} If the attack is illegal.
 * @returns {object} New game state.
 */
Battleships.fire_at = function (game, player, row, column) {
  if (!Battleships.is_legal_attack(game, player, row, column)) {
    throw new Error("This attack is not legal.");
  }

  const next_attacks = copy_attacks(game.attacks);
  next_attacks[String(player)].push([row, column]);

  return {
    "fleets": {
      "1": copy_fleet(game.fleets["1"]),
      "2": copy_fleet(game.fleets["2"])
    },
    "attacks": next_attacks,
    "next_player": Battleships.opponent(player)
  };
};

/**
 * Check whether one ship has been sunk.
 *
 * @param {object} game Current game state.
 * @param {number} defender Player whose ship is checked.
 * @param {object} ship Ship object.
 * @returns {boolean} True if the ship is sunk.
 */
Battleships.is_ship_sunk = function (game, defender, ship) {
  const attacker = Battleships.opponent(defender);
  const attacks = game.attacks[String(attacker)];

  return R.all(function (cell) {
    return R.any(function (attack) {
      return same_cell(attack, cell);
    }, attacks);
  }, ship.cells);
};

/**
 * Check whether a player's whole fleet has been sunk.
 *
 * @param {object} game Current game state.
 * @param {number} defender Player being checked.
 * @returns {boolean} True if every ship is sunk.
 */
Battleships.is_fleet_sunk = function (game, defender) {
  return R.all(function (ship) {
    return Battleships.is_ship_sunk(game, defender, ship);
  }, game.fleets[String(defender)]);
};

/**
 * Find the winning player.
 *
 * @param {object} game Current game state.
 * @returns {number|undefined} Winning player or undefined.
 */
Battleships.winner = function (game) {
  if (Battleships.is_fleet_sunk(game, PLAYER_ONE)) {
    return PLAYER_TWO;
  }

  if (Battleships.is_fleet_sunk(game, PLAYER_TWO)) {
    return PLAYER_ONE;
  }

  return undefined;
};

/**
 * Check whether the game has ended.
 *
 * @param {object} game Current game state.
 * @returns {boolean} True if the game is over.
 */
Battleships.is_ended = function (game) {
  return Battleships.winner(game) !== undefined;
};

/**
 * Return what an attacker can see at a square.
 *
 * @param {object} game Current game state.
 * @param {number} attacker Player viewing their target board.
 * @param {number} row Row index.
 * @param {number} column Column index.
 * @returns {string} "unknown", "hit", or "miss".
 */
Battleships.target_square = function (game, attacker, row, column) {
  if (!Battleships.has_attacked(game, attacker, row, column)) {
    return "unknown";
  }

  return Battleships.attack_result(game, attacker, row, column);
};

export default Object.freeze(Battleships);
