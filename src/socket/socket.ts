//const { Server } = require("socket.io");
import { isGameStarted } from "../main";
import { Server } from "socket.io";

export const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

var iPList: string[] = [];

io.on("connection", (socket) => {
  function sendLogMessage(type: string, user: { id: string; ip: string }) {
    let message: string = "";

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

    io.to(socket.id).emit("log", message);
    console.log(message);
  }
  socket.on("disconnect", (reason) => {
    console.log("Client disconnected " + socket.id + " reason", reason);
    //TODO: a method to see, the current client connections
    console.log("Current client connections actives: ", io.engine.clientsCount);
  });

  sendLogMessage("connected", { id: socket.id, ip: socket.handshake.address });

  //TODO: get socket connection IP
  let userIp: string = socket.handshake.address;

  if (userIp == "::1") {
    sendLogMessage("admin", { id: socket.id, ip: userIp });
  }

  if (!isGameStarted) {
    console.log("Game not started");

    if (!iPList.includes(userIp)) {
      sendLogMessage("created", { id: socket.id, ip: userIp });
      sendLogMessage("moved", { id: socket.id, ip: userIp });

      socket.join(userIp);

      console.log("Actual rooms:", socket.rooms);

      //TODO check rooms in socket
    } else if (io.sockets.adapter.rooms.has(userIp)) {
      sendLogMessage("disconnected", { id: socket.id, ip: userIp });
      socket.disconnect();
    } else {
      socket.join(userIp);
      sendLogMessage("moved", { id: socket.id, ip: userIp });
      console.log("Actual rooms:", socket.rooms);
    }
  } else if (io.sockets.adapter.rooms.has(userIp)) {
    sendLogMessage("disconnected", { id: socket.id, ip: userIp });
    socket.disconnect();
  } else {
    socket.join(userIp);
    sendLogMessage("moved", { id: socket.id, ip: userIp });
  }
});
