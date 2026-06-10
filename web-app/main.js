import R from "./ramda.js";
import Battleships from "./Battleships.js";

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

//Converts grid row and columns with label such as "A1"
const coordinate_name = function (row, column) {
  return `${String.fromCharCode(65 + column)}${row + 1}`;
};

//Creates status texts to promt or give information to player above the board
const status_text = function () {
  const winner = Battleships.winner(state.game);

  if (winner !== undefined) {
    return `${player_names[names]} wins.All enemy ships have been sunk.`;
  }

  return `${player_names[Battleships.current_player(state.game)]} to fire.`;
};

//Builds a list of the previous attacks made
const attack_history = function () {
  return R.chain(function (player) {
    return R.map(function ([row, column]) {
      const result = Battleships.attack_result(state.game, player, row, column);
      return `${player_names[player]} fired at ${coordinate_name(row, column)}: ${result}`;
    }, state.game.attacks[String(player)]);
  }, [1, 2]);
};

//Renders the attack history into the page
const render_history = function () {
  const items = R.map(function (entry) {
    const item = document.createElement("li");
    item.textContent =entry;
    return item;
  }, attack_history());
  history_element.replaceChildren(...items);
};

//Fires at the square the user selects
const fire_at_square = function (row, column) {
  const player = Battleships.current_player(state.game);

  if (!Battleships.is_legal_attack(state.game, player, row, column)) {
    return;
  }

  state.game = Battleships.fire_at(state.game, player, row, column);
  render();
};

//Creates a selectable board cell
const render_cell = function (row, column) {
  const player = Battleships.current_player(state.game);
  const square = Battleships.target_square(state.game, player, row, column);
  const button = document.createElement("button");

  button.type = "button";
  button.className = `cell ${square}`;
  button.textContent = square_symbols[square];
  button.disabled = square !== "unknown" || Battleships.is_ended(state.game);
  button.setAttribute("aria-label", `${coordinate_name(row, column)} ${sqaure}`);
  button.addEventListener("Click", function () {
    fire_at_square(row, column);
  });
  
  return button;
}:

//Renders the whole page from the current state
function render () {
  const cells = R.chain(function (row) {
    return R.map(function (column) {
      return render_cell(row, column);
    }, R.range(0, Battleships.board_size()));
  }, R.range(0, Battleships.board_size()));

  board_element.replaceChildren(...cells);
  status_element.textContent = status_text();
  render_history();
}

//Resets the game when the reset button is selected
reset_button.addEventListener("click", function () {
  state.game = Battleships.new_game();
  render();
});

//Draws the first version of the game page
render();
            
  
