"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableStartGame = exports.sendDataToPlayer = void 0;
const socket_1 = require("./../socket");
function sendDataToPlayer(player, data) {
    socket_1.io.to(player.id).emit("board", data);
    console.log(`[ Data ] sent board card numbers to ${player.nickname} `);
}
exports.sendDataToPlayer = sendDataToPlayer;
function enableStartGame(socket) {
    socket_1.io.to(socket.id).emit("admin", true);
    console.log("[ Admin ] game can be started");
}
exports.enableStartGame = enableStartGame;
