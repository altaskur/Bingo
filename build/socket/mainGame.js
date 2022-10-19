"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const functions_1 = require("../game/functions");
const BINGO_BALLS = 90;
const PLAYER_BOARD_CELLS = 27;
var bongoNumbers = [];
var players = [];
exports.start = (0, functions_1.createGame)(bongoNumbers, BINGO_BALLS, players, PLAYER_BOARD_CELLS);
