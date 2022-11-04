"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const main_1 = require("./../main");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
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
const httpServer = (0, http_1.createServer)();
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
});
(0, functions_1.fillBongo)(GAME_SETTINGS.bongoNumbers, GAME_SETTINGS.BINGO_BALLS);
function getCurrentPlayers() {
    return GAME_SETTINGS.players.map((player) => player.nickname).filter(Boolean);
}
function reloadBoardNumbers(player) {
    return GAME_SETTINGS.players
        .filter((element) => element.ip == player.ip)
        .map((element) => element.boardNumbers)[0];
}
exports.io.on("connection", (socket) => {
    let player = {
        id: socket.id,
        ip: socket.handshake.address,
        boardNumbers: [],
        admin: false,
        nickname: "",
    };
    (0, log_1.sendLogMessage)("connected", player);
    if (player.ip == "::1" || player.ip == "::ffff:127.0.0.1") {
        (0, log_1.sendLogMessage)("admin", player);
        player.admin = true;
    }
    if (!(0, general_1.hasGameStarted)()) {
        console.log("Game not started");
        if (!(0, log_1.isPlayerRegistered)(GAME_SETTINGS.players, player)) {
            (0, log_1.sendLogMessage)("created", player);
            (0, log_1.sendLogMessage)("moved", player);
            socket.join(player.ip);
            player.nickname = "Player " + (GAME_SETTINGS.players.length + 1);
            player.boardNumbers = (0, functions_1.addPlayersBoardNumber)(GAME_SETTINGS.PLAYER_BOARD_CELLS, GAME_SETTINGS.BINGO_BALLS);
            GAME_SETTINGS.players.push(player);
            let playerGameData = {
                player: player,
                players: getCurrentPlayers(),
            };
            console.log();
            (0, data_1.sendDataToPlayer)(playerGameData);
        }
        else if ((0, general_1.checkRoom)(player.ip)) {
            (0, log_1.sendLogMessage)("disconnected", player);
            socket.disconnect();
        }
        else {
            socket.join(player.ip);
            (0, log_1.sendLogMessage)("moved", player);
            player.boardNumbers = reloadBoardNumbers(player);
            console.log("Actual rooms:", socket.rooms);
            let playerGameData = {
                player: player,
                players: getCurrentPlayers(),
            };
            (0, data_1.sendDataToPlayer)(playerGameData);
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
        let playerGameData = {
            player: player,
            players: getCurrentPlayers(),
        };
        (0, data_1.sendDataToPlayer)(playerGameData);
        (0, log_1.sendLogMessage)("moved", player);
    }
    console.log("player", player);
    if (player.ip == "::1" ||
        player.ip == "::ffff:127.0.0.1") {
        console.log("Admin detected");
        player.admin = true;
        (0, data_1.enableStartGame)(socket);
    }
    socket.on("startGame", () => {
        console.log("Game started");
        if (!GAME_SETTINGS.isGameStarted) {
            GAME_SETTINGS.isGameStarted = true;
            (0, functions_1.singBingo)(GAME_SETTINGS.bongoNumbers, GAME_SETTINGS.players, socket);
            socket.emit("gameStarted", true);
        }
    });
    socket.on("disconnect", (reason) => {
        console.log("Client disconnected " + player.id + " reason", reason);
        console.log("Current client connections actives: ", (0, general_1.clientsOnline)());
    });
});
