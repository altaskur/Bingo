import { io } from "./../socket";
import { Player } from "./../socket";

// TODO: Data is a generic type, it can be any type of data
export function sendDataToPlayer(player: Player, data: any) {
  io.to(player.id).emit("board", data);
  console.log("[ Data ] sent to ${player.nickname}", data);
}
