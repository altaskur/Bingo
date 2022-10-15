import { createGame, runGame } from "./game/functions";
// import { app } from "./js/express/express.js";

const BINGO_BALLS: number = 90;
const PLAYER_BOARD_CELLS: number = 27;
var bongoNumbers: number[] = [];
var players: any[] = [];

export var start = createGame(
  bongoNumbers,
  BINGO_BALLS,
  players,
  PLAYER_BOARD_CELLS
);

export var run = runGame(bongoNumbers, players, false, 0);
