// import { createGame } from "./js/game/functions";
// import { app } from "./js/express/express.js";

const BINGO_BALLS: number = 90;
const PLAYER_BOARD_CELLS: number = 27;
var bongoNumbers: number[] = [];
var players: any[] = [];

createGame(bongoNumbers, BINGO_BALLS, players, PLAYER_BOARD_CELLS);

app.listen(3000, () => {
  console.log("Express server on port ", 3000);
});
