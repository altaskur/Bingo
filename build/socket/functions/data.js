"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableStartGame = exports.sendDataToPlayer = void 0;
const socket_1 = require("./../socket");
function sendDataToPlayer(playerGameData) {
    socket_1.io.emit("game", playerGameData);
}
exports.sendDataToPlayer = sendDataToPlayer;
function enableStartGame(socket) {
    socket_1.io.to(socket.id).emit("admin", true);
    console.log("[ Admin ] game can be started");
}
exports.enableStartGame = enableStartGame;
