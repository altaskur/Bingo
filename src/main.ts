//const app = require("./express/express.js");
// const io = require("./socket/socket.js");

import { io } from "./socket/socket";
import { app } from "./express/express";
// import { run } from "./mainGame";

export var isStarted: boolean = false;

app.listen(5173, function () {
  console.log("Example app listening on port 5173!");
});

// console.log(app);
io.listen(5174);
