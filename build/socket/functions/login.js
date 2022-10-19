"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGameStarted = void 0;
const main_1 = require("../../main");
function checkGameStarted() {
    if (main_1.isGameStarted) {
        return true;
    }
    else {
        return false;
    }
}
exports.checkGameStarted = checkGameStarted;
