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
    function sendLogMessage(type, user) {
        let message = "";
        switch (type) {
            case "created":
                message = `[ Created ]User ${user.id} created with IP ${user.ip}`;
                break;
            case "moved":
                message = `[ Moved ] User ${user.id} moved into room ${user.ip}`;
                break;
            case "disconnected":
                message = `[ Disconnected ] User ${user.id} disconnected from the server.`;
                break;
            case "connected":
                message = `[ Connected ] User ${user.ip} connected with session ${user.id} to the server.`;
                break;
            case "admin":
                message = `[ Admin  detected ]`;
                break;
            case "users":
                message = `[ Users ] ${user.id} users connected to the server.`;
                break;
        }
        exports.io.to(socket.id).emit("log", message);
        console.log(message);
    }
    socket.on("disconnect", (reason) => {
        console.log("Client disconnected " + socket.id + " reason", reason);
        console.log("Current client connections actives: ", exports.io.engine.clientsCount);
    });
    sendLogMessage("connected", { id: socket.id, ip: socket.handshake.address });
    let userIp = socket.handshake.address;
    if (userIp == "::1") {
        sendLogMessage("admin", { id: socket.id, ip: userIp });
    }
    if (!main_1.isGameStarted) {
        console.log("Game not started");
        if (!iPList.includes(userIp)) {
            sendLogMessage("created", { id: socket.id, ip: userIp });
            sendLogMessage("moved", { id: socket.id, ip: userIp });
            socket.join(userIp);
            console.log("Actual rooms:", socket.rooms);
        }
        else if (exports.io.sockets.adapter.rooms.has(userIp)) {
            sendLogMessage("disconnected", { id: socket.id, ip: userIp });
            socket.disconnect();
        }
        else {
            socket.join(userIp);
            sendLogMessage("moved", { id: socket.id, ip: userIp });
            console.log("Actual rooms:", socket.rooms);
        }
    }
    else if (exports.io.sockets.adapter.rooms.has(userIp)) {
        sendLogMessage("disconnected", { id: socket.id, ip: userIp });
        socket.disconnect();
    }
    else {
        socket.join(userIp);
        sendLogMessage("moved", { id: socket.id, ip: userIp });
    }
});
