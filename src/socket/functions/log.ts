import { io } from "./../socket";
import { Player } from "./../socket";

// enum LogMensages{
//   create= "create",
//   moved = "moved",
//   disconnected = "disconnected",
//   connected = "connected",
//   admin = "admin",
//   users = "users",
// }


export function sendLogMessage(type: string, player: Player) {

  // TODO Record<string,string> Object -> hey,value
  const messageTypes: Record<string,string> =  {
    created: `[ Created ]User ${player.id} created with IP ${player.ip}`,
    moved:`[ Moved ] User ${player.id} moved into room ${player.ip}`,
    disconnected: `[ Disconnected ] User ${player.id} disconnected from the server.`,
    connected: `[ Connected ] User ${player.ip} connected with session ${player.id} to the server.`,
    admin:`[ Admin  detected ]`,
    users: `[ Users ] ${player.id} users connected to the server.`,
  };

  // switch (type) {
  //   case "Created":
  //     message = `[ Created ]User ${player.id} created with IP ${player.ip}`;
  //     break;
  //   case "moved":
  //     message = `[ Moved ] User ${player.id} moved into room ${player.ip}`;
  //     break;
  //   case "disconnected":
  //     message = `[ Disconnected ] User ${player.id} disconnected from the server.`;
  //     break;
  //   case "connected":
  //     message = `[ Connected ] User ${player.ip} connected with session ${player.id} to the server.`;
  //     break;
  //   case "admin":
  //     message = `[ Admin  detected ]`;
  //     break;
  //   case "users":
  //     message = `[ Users ] ${player.id} users connected to the server.`;
  //     break;
  // }

  io.to(player.id).emit("log", messageTypes[type]);
  console.log(messageTypes[type]);
}

export function isPlayerRegistered(players: Player[], player: Player): boolean {

  let registered = players.some((element) => {
    return element.ip == player.ip;
  });
  console.log("player registered:", players);
  console.log("Registered:", registered);
  return registered;
}
