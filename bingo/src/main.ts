import "./assets/css/styles.css";

import { createGame } from "./js/functions";
const BINGO_BALLS: number = 90;
const PLAYER_BOARD_CELLS: number = 27;
var bongoNumbers: number[] = [];
var players: any[] = [];

createGame(bongoNumbers, BINGO_BALLS, players, PLAYER_BOARD_CELLS);
