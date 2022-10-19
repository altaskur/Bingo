"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDataToPlayer = void 0;
const socket_1 = require("./../socket");
function sendDataToPlayer(player, data) {
    socket_1.io.to(player.id).emit("board", data);
    console.log("[ Data ] sent to ${player.nickname}", data);
}
exports.sendDataToPlayer = sendDataToPlayer;
