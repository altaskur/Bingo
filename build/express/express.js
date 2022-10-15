"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use("/", express_1.default.static(__dirname + "/public/client/"));
exports.app.use("/admin", express_1.default.static(__dirname + "/public/admin/"));
console.log(__dirname, "public/client");
