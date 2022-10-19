"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasGameStarted = exports.checkRoom = exports.clientsOnline = void 0;
const socket_1 = require("../socket");
const main_1 = require("../../main");
function clientsOnline() {
    return socket_1.io.engine.clientsCount;
}
exports.clientsOnline = clientsOnline;
function checkRoom(room) {
    return socket_1.io.sockets.adapter.rooms.has(room);
}
exports.checkRoom = checkRoom;
function hasGameStarted() {
    if (main_1.isGameStarted) {
        return true;
    }
    else {
        return false;
    }
}
exports.hasGameStarted = hasGameStarted;
