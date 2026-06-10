import R from "./ramda.js";
import Battleships from "./Battleships.js");

//Stores current game state
const state = {
  "game" : Battleships.new_game()
};

//Gets the board element from the HTML
const board_element = document.querySelector("#board");

//Gets the status element from the HTML
const status_element = document.querySelector("#status");

//Gets the reset button from the HTML
const reset_button = document.querySelector("#reset");

//Gets the history list of plays from the HTML
const history_element = document.querySelector("#history");

//Stores the display name for each player
const player_names = Object.freeze({
  "1" : "Player 1",
  "2" : "Player 2"
});

//Stores the symbols for "hit" or "miss"
const square_symbols = Object.freeze({
  "unknown" : "",
  "hit" : "X",
  "miss" : "."
});

//
