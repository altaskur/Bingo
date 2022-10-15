"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const main_1 = require("../main");
const socket_io_1 = require("socket.io");
exports.io = new socket_io_1.Server({
    cors: {
        origin: "http://localhost:5173",
    },
});
var iPList = [];
exports.io.on("connection", (socket) => {
    console.log("Client connected ", socket.id);
    socket.emit("log", "Client connected " + socket.id);
    socket.on("disconnect", (reason) => {
        console.log("Client disconnected " + socket.id + " reason", reason);
        console.log(exports.io.engine.clientsCount);
    });
    let userIp = socket.handshake.address;
    if (userIp == "::ffff:127.0.0.1") {
        exports.io.to(socket.id).emit("log", "[ ADMIN DETECTED ] " + userIp);
        console.log("[ ADMIN DETECTED ] " + userIp);
    }
    if (!main_1.isStarted) {
        console.log("Game not started");
        if (!iPList.includes(userIp)) {
            console.log("New user connected");
            iPList.push(userIp);
            console.log("New IP: " + userIp);
            socket.join(userIp);
            exports.io.to(socket.id).emit("log", "[Moved to new room] Room: " + userIp);
            console.log("Joined room: " + userIp);
            console.log("Actual rooms:", socket.rooms);
            console.log();
        }
        else if (exports.io.sockets.adapter.rooms.has(userIp)) {
            console.log("User " + userIp + " already connected");
            exports.io.to(socket.id).emit("log", "[Disconnected] User " + userIp + " already connected");
            socket.disconnect();
        }
        else {
            socket.join(userIp);
            exports.io.to(socket.id).emit("log", "[Moved to new room] Room: " + userIp);
            console.log("Joined room: " + userIp);
            console.log("Actual rooms:", socket.rooms);
        }
    }
    else if (exports.io.sockets.adapter.rooms.has(userIp)) {
        console.log("User " + userIp + " already connected");
        exports.io.to(socket.id).emit("log", "[Disconnected] User " + userIp + " already connected");
        socket.disconnect();
    }
    else {
        socket.join(userIp);
        exports.io.to(socket.id).emit("log", "[Moved to new room] Room: " + userIp);
        console.log("Joined room: " + userIp);
        console.log("Actual rooms:", socket.rooms);
    }
});
