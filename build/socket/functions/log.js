"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlayerRegistered = exports.sendLogMessage = void 0;
const socket_1 = require("./../socket");
function sendLogMessage(type, player) {
    let message = "";
    switch (type) {
        case "created":
            message = `[ Created ]User ${player.id} created with IP ${player.ip}`;
            break;
        case "moved":
            message = `[ Moved ] User ${player.id} moved into room ${player.ip}`;
            break;
        case "disconnected":
            message = `[ Disconnected ] User ${player.id} disconnected from the server.`;
            break;
        case "connected":
            message = `[ Connected ] User ${player.ip} connected with session ${player.id} to the server.`;
            break;
        case "admin":
            message = `[ Admin  detected ]`;
            break;
        case "users":
            message = `[ Users ] ${player.id} users connected to the server.`;
            break;
    }
    socket_1.io.to(player.id).emit("log", message);
    console.log(message);
}
exports.sendLogMessage = sendLogMessage;
function isPlayerRegistered(players, player) {
    let registered = players.some((element) => {
        return element.ip == player.ip;
    });
    console.log("player registered:", players);
    console.log("Registered:", registered);
    return registered;
}
exports.isPlayerRegistered = isPlayerRegistered;
