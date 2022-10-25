import { Socket } from "socket.io";
import { Player } from "./../socket/socket";
// Bongo functions

interface PlayerWin {
  hasWon: boolean;
  players: String[];
}

interface RoundData {
  round: number;
  bongoNumber: number;
  playersHasNumber: String[];
}

function generateRandomNumber(bingoBalls: number): number {
  return Math.floor(Math.random() * bingoBalls);
}

function generateBongoNumber(
  bongoNumbers: number[],
  bingoBalls: number
): number {
  let randomNumber: number = generateRandomNumber(bingoBalls);

  if (bongoNumbers.includes(randomNumber)) {
    return generateBongoNumber(bongoNumbers, bingoBalls);
  } else {
    return randomNumber;
  }
}

export function fillBongo(bongoNumbers: number[], bingoBalls: number) {
  while (bongoNumbers.length < bingoBalls) {
    let randomNumber: number = generateBongoNumber(bongoNumbers, bingoBalls);
    bongoNumbers.push(randomNumber);
  }
  console.log("Numbers in to de Bongo", bongoNumbers);
}

// Player functions

function generatePlayerBoardNumbers(
  playerNumbers: number[],
  limitOfNumbers: number
): number {
  let randomNumber: number = generateRandomNumber(limitOfNumbers);
  if (
    playerNumbers.includes(randomNumber) &&
    playerNumbers.length < limitOfNumbers
  ) {
    return generatePlayerBoardNumbers(playerNumbers, limitOfNumbers);
  }
  return randomNumber;
}

export function addPlayersBoardNumber(
  playerBoardCells: number,
  bongoNumbers: number
) {
  let playerBoardNumbers: number[] = [];
  while (playerBoardNumbers.length < playerBoardCells) {
    let randomNumber = generatePlayerBoardNumbers(
      playerBoardNumbers,
      bongoNumbers
    );

    playerBoardNumbers.push(randomNumber);
  }
  return playerBoardNumbers;
}

// Game functions

function extractBongoBall(bongoNumbers: number[]): number {
  let randomNumber = generateRandomNumber(bongoNumbers.length);
  let bongoNumber = bongoNumbers[randomNumber];
  bongoNumbers.splice(randomNumber, 1);

  return bongoNumber;
}

function extractPlayerBoardNumber(
  playerNumbers: number[],
  bongoNumber: number
): number[] {
  playerNumbers = playerNumbers.filter((number) => number != bongoNumber);
  return playerNumbers;
}

function checkIfPlayersHasNumber(
  bongoNumber: number,
  players: Player[]
): String[] {
  //! any !!!!!!!

  let playersHasNumber: String[] = [];

  players.forEach((player: any) => {
    let playerNumbers = player.boardNumbers;
    console.log(`${player.ip}: `, playerNumbers);

    //!! any !!
    console.log("player", player);
    console.log("playerNumbers", player.boardNumbers);
    let playerBoardNumbers: any = player.boardNumbers;

    if (playerBoardNumbers.includes(bongoNumber)) {
      console.log("Player: ", player.ip, "has the number: ", bongoNumber);
      playersHasNumber.push(player.ip);
      player.boardNumbers = extractPlayerBoardNumber(
        playerBoardNumbers,
        bongoNumber
      );
    }
  });

  return playersHasNumber;
}

function checkIfPlayersHasWon(players: Player[]): PlayerWin {
  let isPlayerWin: PlayerWin = {
    hasWon: false,
    players: [],
  };

  //! any !!!!!!!
  players.forEach((player: any) => {
    if (player.boardNumbers.length == 0) {
      console.log("Player: ", player.ip, "has won!");
      isPlayerWin.hasWon = true;
      isPlayerWin.players.push(player.ip);
    }
  });
  return isPlayerWin;
}

// By: @LuisLLamas_es
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function singBingo(
  bongoNumbers: number[],
  players: Player[],
  socket: Socket
) {
  let isPlayerWin: PlayerWin = {
    hasWon: false,
    players: [],
  };
  let playerHasNumber: String[] = [];

  let round: number = 0;

  while (bongoNumbers.length > 0 && !isPlayerWin.hasWon) {
    let bongoNumber = extractBongoBall(bongoNumbers);

    playerHasNumber = checkIfPlayersHasNumber(bongoNumber, players);
    isPlayerWin = checkIfPlayersHasWon(players);

    let roundData: RoundData = {
      round: round,
      bongoNumber: bongoNumber,
      playersHasNumber: playerHasNumber,
    };

    socket.emit("round", roundData);

    round++;
    await delay(1000);
  }

  if (isPlayerWin.hasWon) {
    console.log("BINGO!");
    socket.emit("endGame", isPlayerWin.players);
  } else if (bongoNumbers.length == 0) {
    socket.emit("endGame", isPlayerWin.players.push("Machine"));
  }
}
