import { isGameStarted } from "./../main";
import { Server } from "socket.io";

import { sendLogMessage, isPlayerRegistered } from "./functions/log";
import { enableStartGame, sendDataToPlayer } from "./functions/data";
import { clientsOnline, checkRoom, hasGameStarted } from "./functions/general";

import { fillBongo, addPlayersBoardNumber, singBingo } from "../game/functions";

//TODO: why players != as Player ?
interface GameSettings {
  BINGO_BALLS: number;
  PLAYER_BOARD_CELLS: number;
  bongoNumbers: number[];
  isGameStarted: boolean;
  players: Player[];
}

export interface PlayerGameData {
  player: Player;
  players: (String | undefined)[];
}
export interface Player {
  id: string;
  ip: string;
  nickname?: string;
  boardNumbers: number[];
  admin: boolean;
}

// TODO: var or let ?
const GAME_SETTINGS: GameSettings = {
  BINGO_BALLS: 90,
  PLAYER_BOARD_CELLS: 27,
  bongoNumbers: [],
  isGameStarted,
  players: [],
};

export const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

fillBongo(GAME_SETTINGS.bongoNumbers, GAME_SETTINGS.BINGO_BALLS);

function getCurrentPlayers(): (string | undefined)[] {
  //TODO differences filter vs map

  return GAME_SETTINGS.players.map((player) => player.nickname).filter(Boolean);

  // playersNickname = GAME_SETTINGS.players.filter((player) => player.nickname);
}

function reloadBoardNumbers(player: Player) {
  return GAME_SETTINGS.players
    .filter((element) => element.ip == player.ip)
    .map((element) => element.boardNumbers)[0];
}

io.on("connection", (socket) => {
  // Storage socket session data
  let player: Player = {
    id: socket.id,
    //TODO: get socket connection IP
    ip: socket.handshake.address,
    boardNumbers: [],
    admin: false,
  };

  sendLogMessage("connected", player);

  // Check if the user is an admin

  //TODO: why socket.handshake.address change ip format ?
  if (player.ip == "::1" || player.ip == "::ffff:127.0.0.1") {
    sendLogMessage("admin", player);
    player.admin = true;
  }

  if (!hasGameStarted()) {
    console.log("Game not started");

    if (!isPlayerRegistered(GAME_SETTINGS.players, player)) {
      sendLogMessage("created", player);
      sendLogMessage("moved", player);
      socket.join(player.ip);
      player.nickname = "Player " + (GAME_SETTINGS.players.length + 1);
      player.boardNumbers = addPlayersBoardNumber(
        GAME_SETTINGS.PLAYER_BOARD_CELLS,
        GAME_SETTINGS.BINGO_BALLS
      );

      GAME_SETTINGS.players.push(player);

      let playerGameData: PlayerGameData = {
        player: player,
        players: getCurrentPlayers(),
      };
      console.log();
      sendDataToPlayer(socket, playerGameData);

      //TODO: check rooms in socket
    } else if (checkRoom(player.ip)) {
      sendLogMessage("disconnected", player);
      socket.disconnect();
    } else {
      socket.join(player.ip);
      sendLogMessage("moved", player);

      // reload player board numbers
      player.boardNumbers = reloadBoardNumbers(player);

      console.log("Actual rooms:", socket.rooms);

      let playerGameData: PlayerGameData = {
        player: player,
        players: getCurrentPlayers(),
      };
      sendDataToPlayer(socket, playerGameData);
    }
  } else if (checkRoom(player.ip)) {
    sendLogMessage("disconnected", player);
    socket.disconnect();
  } else {
    console.log("Listado de jugadores", GAME_SETTINGS.players);
    console.log("Datos actuales:", player);
    socket.join(player.ip);

    let playerGameData: PlayerGameData = {
      player: player,
      players: getCurrentPlayers(),
    };

    sendDataToPlayer(socket, playerGameData);

    sendLogMessage("moved", player);
  }

  console.log("player", player);

  // if (canGameStart(GAME_SETTINGS.players)) {

  if (player.ip == "::1" || player.ip == "::ffff:127.0.0.1") {
    console.log("Admin detected 2");
    player.admin = true;
    enableStartGame(socket);
  }

  socket.on("startGame", () => {
    console.log("Game started");
    GAME_SETTINGS.isGameStarted = true;
    singBingo(GAME_SETTINGS.bongoNumbers, GAME_SETTINGS.players, socket);
  });
  // }

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected " + player.id + " reason", reason);
    console.log("Current client connections actives: ", clientsOnline());
  });
});
