import express from "express";

// const express = require("express");

export const app = express();

//TODO app.use(express.static("client"));
app.use("/", express.static(__dirname + "/public/client/"));
app.use("/admin", express.static(__dirname + "/public/admin/"));

console.log(__dirname, "public/client");
