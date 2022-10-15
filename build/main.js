"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStarted = void 0;
const socket_1 = require("./socket/socket");
const express_1 = require("./express/express");
exports.isStarted = false;
express_1.app.listen(5173, function () {
    console.log("Example app listening on port 5173!");
});
socket_1.io.listen(5174);
