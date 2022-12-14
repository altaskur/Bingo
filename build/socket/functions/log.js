"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlayerRegistered = exports.sendLogMessage = void 0;
const socket_1 = require("./../socket");
function sendLogMessage(type, player) {
    const messageTypes = {
        created: `[ Created ]User ${player.id} created with IP ${player.ip}`,
        moved: `[ Moved ] User ${player.id} moved into room ${player.ip}`,
        disconnected: `[ Disconnected ] User ${player.id} disconnected from the server.`,
        connected: `[ Connected ] User ${player.ip} connected with session ${player.id} to the server.`,
        admin: `[ Admin  detected ]`,
        users: `[ Users ] ${player.id} users connected to the server.`,
    };
    socket_1.io.to(player.id).emit("log", messageTypes[type]);
    console.log(messageTypes[type]);
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
