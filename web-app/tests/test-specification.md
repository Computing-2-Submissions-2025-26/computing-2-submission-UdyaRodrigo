# Unit Test Specification

These tests describe the public behaviour of `Module.js`.

## New Game

Given a new game, player 1 should be the first player to fire.

Given a new game, neither player should have made any attacks.

## Legal Attacks

Given the current player chooses a square inside the board that they have not attacked before, the attack should be legal.

Given a player attacks legally, the turn should pass to the other player.

Given a player tries to attack the same square twice, the module should reject the attack.

## Attack Results

Given a player fires at a coordinate containing an enemy ship, the result should be `"!!!hit!!!"`.

Given a player fires at a coordinate without an enemy ship, the result should be `"!!!miss!!!"`.

## Victory

Given all cells of a player's fleet have been hit, the opponent should be returned as the winner.

Given not all ships are sunk, the game should not be ended.
