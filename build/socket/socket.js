"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const main_1 = require("./../main");
const socket_io_1 = require("socket.io");
const log_1 = require("./functions/log");
const data_1 = require("./functions/data");
const general_1 = require("./functions/general");
const functions_1 = require("../game/functions");
const GAME_SETTINGS = {
    BINGO_BALLS: 90,
    PLAYER_BOARD_CELLS: 27,
    bongoNumbers: [],
    isGameStarted: main_1.isGameStarted,
    players: [],
};
exports.io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:5173",
    },
});
(0, functions_1.fillBongo)(GAME_SETTINGS.bongoNumbers, GAME_SETTINGS.BINGO_BALLS);
exports.io.on("connection", (socket) => {
    let player = {
        id: socket.id,
        ip: socket.handshake.address,
        boardNumbers: [],
    };
    (0, log_1.sendLogMessage)("connected", player);
    if (player.ip == "::1" || player.ip == "::ffff:127.0.0.1") {
        (0, log_1.sendLogMessage)("admin", player);
    }
    if (!(0, general_1.hasGameStarted)()) {
        console.log("Game not started");
        if (!(0, log_1.isPlayerRegistered)(GAME_SETTINGS.players, player)) {
            (0, log_1.sendLogMessage)("created", player);
            (0, log_1.sendLogMessage)("moved", player);
            socket.join(player.ip);
            player.nickname = "Player " + (GAME_SETTINGS.players.length + 1);
            (0, functions_1.addPlayersBoardNumber)(GAME_SETTINGS.PLAYER_BOARD_CELLS, GAME_SETTINGS.BINGO_BALLS, player.boardNumbers);
            (0, data_1.sendDataToPlayer)(player, player.boardNumbers);
            GAME_SETTINGS.players.push(player);
        }
        else if ((0, general_1.checkRoom)(player.ip)) {
            (0, log_1.sendLogMessage)("disconnected", player);
            socket.disconnect();
        }
        else {
            socket.join(player.ip);
            (0, log_1.sendLogMessage)("moved", player);
            console.log("Actual rooms:", socket.rooms);
        }
    }
    else if ((0, general_1.checkRoom)(player.ip)) {
        (0, log_1.sendLogMessage)("disconnected", player);
        socket.disconnect();
    }
    else {
        console.log("Listado de jugadores", GAME_SETTINGS.players);
        console.log("Datos actuales:", player);
        socket.join(player.ip);
        (0, data_1.sendDataToPlayer)(player, player.boardNumbers);
        (0, log_1.sendLogMessage)("moved", player);
    }
    console.log("player", player);
    if (player.ip == "::1" || player.ip == "::ffff:127.0.0.1") {
        console.log("Admin detected 2");
        (0, data_1.enableStartGame)(socket);
    }
    socket.on("startGame", () => {
        console.log("Game started");
        GAME_SETTINGS.isGameStarted = true;
        (0, functions_1.singBingo)(GAME_SETTINGS.bongoNumbers, GAME_SETTINGS.players, socket);
    });
    socket.on("disconnect", (reason) => {
        console.log("Client disconnected " + player.id + " reason", reason);
        console.log("Current client connections actives: ", (0, general_1.clientsOnline)());
    });
});
