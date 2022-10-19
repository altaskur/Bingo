"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGameStarted = void 0;
const socket_1 = require("./socket/socket");
const express_1 = require("./express/express");
exports.isGameStarted = false;
express_1.app.listen(5173, function () {
    console.log("Express server in port 5173!");
});
socket_1.io.listen(5174);
