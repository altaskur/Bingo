"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const socket_io_1 = require("socket.io");
const log_1 = require("./functions/log");
const data_1 = require("./functions/data");
const general_1 = require("./functions/general");
const functions_1 = require("../game/functions");
var gameSettings = {
    BINGO_BALLS: 90,
    PLAYER_BOARD_CELLS: 27,
    bongoNumbers: [],
    players: [{}],
};
exports.io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:5173",
    },
});
(0, functions_1.fillBongo)(gameSettings.bongoNumbers, gameSettings.BINGO_BALLS);
exports.io.on("connection", (socket) => {
    var player = {
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
        if (!(0, log_1.isPlayerRegistered)(gameSettings.players, player)) {
            (0, log_1.sendLogMessage)("created", player);
            (0, log_1.sendLogMessage)("moved", player);
            socket.join(player.ip);
            player.nickname = "Player " + gameSettings.players.length;
            (0, functions_1.addPlayersBoardNumber)(gameSettings.PLAYER_BOARD_CELLS, gameSettings.BINGO_BALLS, player.boardNumbers);
            (0, data_1.sendDataToPlayer)(player, player.boardNumbers);
            gameSettings.players.push(player);
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
        console.log("Listado de jugadores", gameSettings.players);
        console.log("Datos actuales:", player);
        socket.join(player.ip);
        (0, data_1.sendDataToPlayer)(player, player.boardNumbers);
        (0, log_1.sendLogMessage)("moved", player);
    }
    socket.on("disconnect", (reason) => {
        console.log("Client disconnected " + player.id + " reason", reason);
        console.log("Current client connections actives: ", (0, general_1.clientsOnline)());
    });
});
