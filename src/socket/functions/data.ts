import { Socket } from "socket.io";
import { io } from "./../socket";
import { PlayerGameData } from "./../socket";

// TODO: Data is a generic type, it can be any type of data
export function sendDataToPlayer(
  socket: Socket,
  playerGameData: PlayerGameData
) {
  io.to(socket.id).emit("game", playerGameData);
}

export function enableStartGame(socket: Socket) {
  io.to(socket.id).emit("admin", true);
  console.log("[ Admin ] game can be started");
}
