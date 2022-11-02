import { io } from "./socket/socket";
import { app } from "./express/express";
// import { run } from "./mainGame";

export var isGameStarted: boolean = false;

app.listen(5173, function () {
  console.log("Express server in port 5173!");
});

// console.log(app);
io.listen(5174);
