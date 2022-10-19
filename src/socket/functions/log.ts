import { io } from "./../socket";
import { Player } from "./../socket";
export function sendLogMessage(type: string, player: Player) {
  let message: string = "";

  switch (type) {
    case "created":
      message = `[ Created ]User ${player.id} created with IP ${player.ip}`;
      break;
    case "moved":
      message = `[ Moved ] User ${player.id} moved into room ${player.ip}`;
      break;
    case "disconnected":
      message = `[ Disconnected ] User ${player.id} disconnected from the server.`;
      break;
    case "connected":
      message = `[ Connected ] User ${player.ip} connected with session ${player.id} to the server.`;
      break;
    case "admin":
      message = `[ Admin  detected ]`;
      break;
    case "users":
      message = `[ Users ] ${player.id} users connected to the server.`;
      break;
  }

  io.to(player.id).emit("log", message);
  console.log(message);
}

export function isPlayerRegistered(players: Player[], player: Player): boolean {
  //TODO: View some method
  let registered = players.some((element) => {
    return element.ip == player.ip;
  });
  console.log("player registered:", players);
  console.log("Registered:", registered);
  return registered;
}
