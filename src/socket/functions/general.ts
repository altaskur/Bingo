import { Player } from "./../socket";
import { io } from "../socket";
import { isGameStarted } from "../../main";

export function clientsOnline() {
  return io.engine.clientsCount;
}

export function checkRoom(room: string) {
  //TODO: a method to see, the current client connections
  return io.sockets.adapter.rooms.has(room);
}

export function hasGameStarted() {
  if (isGameStarted) {
    return true;
  } else {
    return false;
  }
}

export function canGameStart(players: Player[]): boolean {
  console.log("Players online:", players);

  return players.length > 2 ? true : false;
}
