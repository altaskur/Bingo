import { Server } from "socket.io";

import { sendLogMessage, isPlayerRegistered } from "./functions/log";
import { sendDataToPlayer } from "./functions/data";
import { clientsOnline, checkRoom, hasGameStarted } from "./functions/general";

import { fillBongo, addPlayersBoardNumber } from "../game/functions";

export interface Player {
  id: string;
  ip: string;
  nickname?: string;
  boardNumbers: number[];
}
var gameSettings = {
  BINGO_BALLS: 90,
  PLAYER_BOARD_CELLS: 27,
  bongoNumbers: [],
  players: [<Player>{}],
};

export const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

fillBongo(gameSettings.bongoNumbers, gameSettings.BINGO_BALLS);

io.on("connection", (socket) => {
  // Storage socket session data
  var player: Player = {
    id: socket.id,
    //TODO: get socket connection IP
    ip: socket.handshake.address,
    boardNumbers: [],
  };
  sendLogMessage("connected", player);

  // Check if the user is an admin
  if (player.ip == "::1" || player.ip == "::ffff:127.0.0.1") {
    sendLogMessage("admin", player);
  }

  if (!hasGameStarted()) {
    console.log("Game not started");

    if (!isPlayerRegistered(gameSettings.players, player)) {
      sendLogMessage("created", player);
      sendLogMessage("moved", player);
      socket.join(player.ip);
      player.nickname = "Player " + gameSettings.players.length;
      addPlayersBoardNumber(
        gameSettings.PLAYER_BOARD_CELLS,
        gameSettings.BINGO_BALLS,
        player.boardNumbers
      );

      sendDataToPlayer(player, player.boardNumbers);

      gameSettings.players.push(player);

      //TODO: check rooms in socket
    } else if (checkRoom(player.ip)) {
      sendLogMessage("disconnected", player);
      socket.disconnect();
    } else {
      socket.join(player.ip);
      sendLogMessage("moved", player);
      console.log("Actual rooms:", socket.rooms);
    }
  } else if (checkRoom(player.ip)) {
    sendLogMessage("disconnected", player);
    socket.disconnect();
  } else {
    console.log("Listado de jugadores", gameSettings.players);
    console.log("Datos actuales:", player);
    socket.join(player.ip);
    sendDataToPlayer(player, player.boardNumbers);
    sendLogMessage("moved", player);
  }

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected " + player.id + " reason", reason);
    console.log("Current client connections actives: ", clientsOnline());
  });
});
