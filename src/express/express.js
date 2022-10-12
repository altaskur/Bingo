const express = require("express");
const path = require("path");
const app = express();

//TODO app.use(express.static("client"));
app.use("/", express.static(path.join(__dirname, "public/client")));
app.use("/admin", express.static(path.join(__dirname, "public/admin")));

console.log(path.join(__dirname, "public/client"));
module.exports = app;
