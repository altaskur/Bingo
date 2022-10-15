//const { Server } = require("socket.io");
import { isStarted } from "../main";
import { Server } from "socket.io";

export const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

var iPList: string[] = [];

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

io.on("connection", (socket) => {
  console.log("Client connected ", socket.id);

  socket.emit("log", "Client connected " + socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected " + socket.id + " reason", reason);
    console.log(io.engine.clientsCount);
  });

  // socket.data.username = "Alice" + socket.id;
  // console.log(socket.rooms); // Set { <socket.id> }
  // socket.join("room1");
  // console.log(socket.rooms); // Set { <socket.id>, "room1" }
  // const sockets = await io.fetchSockets();
  // console.log("Sockets: ", sockets.length);
  // sockets.forEach((s) => {
  //   console.log(s.data.username);
  // });

  //TODO: get socket connection IP
  let userIp: string = socket.handshake.address;

  if (userIp == "::ffff:127.0.0.1") {
    io.to(socket.id).emit("log", "[ ADMIN DETECTED ] " + userIp);
    console.log("[ ADMIN DETECTED ] " + userIp);
  }

  if (!isStarted) {
    console.log("Game not started");

    if (!iPList.includes(userIp)) {
      console.log("New user connected");
      iPList.push(userIp);
      console.log("New IP: " + userIp);

      socket.join(userIp);
      io.to(socket.id).emit("log", "[Moved to new room] Room: " + userIp);

      console.log("Joined room: " + userIp);
      console.log("Actual rooms:", socket.rooms);

      console.log();
      //TODO check rooms in socket
    } else if (io.sockets.adapter.rooms.has(userIp)) {
      console.log("User " + userIp + " already connected");
      io.to(socket.id).emit(
        "log",
        "[Disconnected] User " + userIp + " already connected"
      );
      socket.disconnect();
    } else {
      socket.join(userIp);
      io.to(socket.id).emit("log", "[Moved to new room] Room: " + userIp);

      console.log("Joined room: " + userIp);
      console.log("Actual rooms:", socket.rooms);
    }
  } else if (io.sockets.adapter.rooms.has(userIp)) {
    console.log("User " + userIp + " already connected");
    io.to(socket.id).emit(
      "log",
      "[Disconnected] User " + userIp + " already connected"
    );
    socket.disconnect();
  } else {
    socket.join(userIp);
    io.to(socket.id).emit("log", "[Moved to new room] Room: " + userIp);

    console.log("Joined room: " + userIp);
    console.log("Actual rooms:", socket.rooms);
  }
});
