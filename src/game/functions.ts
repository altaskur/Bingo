import { Socket } from "socket.io";
import { Player } from "./../socket/socket";
// Bongo functions

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
  bongoNumbers: number,
  playerBoardNumbers: number[]
) {
  while (playerBoardNumbers.length < playerBoardCells) {
    let randomNumber = generatePlayerBoardNumbers(
      playerBoardNumbers,
      bongoNumbers
    );

    playerBoardNumbers.push(randomNumber);
  }
  console.log("Player board numbers", playerBoardNumbers);
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

function checkIfPlayersHasNumber(bongoNumber: number, players: Player[]) {
  //! any !!!!!!!
  players.forEach((player: any) => {
    let playerNumbers = player.boardNumbers;
    console.log(`${player.ip}: `, playerNumbers);

    //!! any !!
    console.log("player", player);
    console.log("playerNumbers", player.boardNumbers);
    let playerBoardNumbers: any = player.boardNumbers;

    if (playerBoardNumbers.includes(bongoNumber)) {
      console.log("Player: ", player.ip, "has the number: ", bongoNumber);
      player.boardNumbers = extractPlayerBoardNumber(
        playerBoardNumbers,
        bongoNumber
      );
    }
  });
}

function checkIfPlayersHasWon(players: Player[]): boolean {
  let isPlayerWin: boolean = false;
  //! any !!!!!!!
  players.forEach((player: any) => {
    if (player.boardNumbers.length == 0) {
      console.log("Player: ", player.ip, "has won!");
      isPlayerWin = true;
    }
  });
  return isPlayerWin;
}

// function roundBongoTurn(bongoNumbers: number[]): number {
//   let bongoNumber = extractBongoBall(bongoNumbers);
//   console.log("Extracted ball: ", bongoNumber);
//   return bongoNumber;
// }

// function roundPlayerTurn(
//   players: Player[],
//   bongoNumber: number,
//   isPlayerWin: boolean
// ): boolean {
//   checkIfPlayersHasNumber(bongoNumber, players);
//   isPlayerWin = checkIfPlayersHasWon(players);

//   return isPlayerWin;
// }

// export async function runGame(
//   bongoNumbers: number[],
//   players: Player[],
//   isPlayerWin: boolean,
//   round: number
// ): Promise<boolean | [number[], boolean]> {
//   await setTimeout(function () {
//     console.log("--------------------");
//     console.log("Round: ", round);
//     console.log("--------------------");
//     console.log("Balls in Bongo: ", bongoNumbers);
//     let bongoNumber = roundBongoTurn(bongoNumbers);
//     roundPlayerTurn(players, bongoNumber, isPlayerWin);
//   }, 100);
//   return [bongoNumbers, isPlayerWin];
// }

// By: @LuisLLamas_es
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function singBingo(
  bongoNumbers: number[],
  players: Player[],
  socket: Socket
) {
  // console.log("Singing BINGO");
  let isPlayerWin: boolean = false;
  let round: number = 0;

  while (bongoNumbers.length > 0 && !isPlayerWin) {
    // console.log("--------------------");
    // console.log("Round: ", round);
    // console.log("--------------------");
    // console.log("Balls in Bongo: ", bongoNumbers);

    let bongoNumber = extractBongoBall(bongoNumbers);
    // console.log("Extracted ball: ", bongoNumber);

    checkIfPlayersHasNumber(bongoNumber, players);
    isPlayerWin = checkIfPlayersHasWon(players);

    let roundData = {
      bongoNumber: bongoNumber,
      checkIfPlayersHasNumber: players,
      isPlayerWin: isPlayerWin,
    };

    socket.emit("round", roundData);

    round++;
    await delay(1000);
  }

  if (isPlayerWin) {
    console.log("BINGO!");
  }
}
