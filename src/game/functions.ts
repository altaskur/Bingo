// Bongo functions

function generateRandomNumber(bingoBalls: number): number {
  return Math.floor(Math.random() * bingoBalls);
}

//TODO: How to make a recursive function
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

function fillBongo(bongoNumbers: number[], bingoBalls: number) {
  while (bongoNumbers.length < bingoBalls) {
    let randomNumber: number = generateBongoNumber(bongoNumbers, bingoBalls);
    bongoNumbers.push(randomNumber);
  }
  console.log("Numbers in to de Bongo", bongoNumbers);
}

//   //TODO: Show the difference between .toString() and String();
//   boardCellsInput.forEach((input) => {
//     let randomNumber = generateRandomNumber(bingoBalls).toString();
//     input.value = randomNumber;
//   });
// }

// Player functions

// TODO: See how to use objet type
function addPlayer(players: any[]) {
  let playerPosition = players.length + 1;
  players.push({ player: `Player ${playerPosition}`, numbers: [] });
}

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

function addPlayersBoardNumber(
  players: any[],
  playerBoardCells: number,
  bingoBalls: number
) {
  players.forEach((player: any) => {
    let playerBoardNumbers: number[] = player.numbers;
    // TODO: `` string interpolation

    while (playerBoardNumbers.length <= playerBoardCells) {
      let randomNumber = generatePlayerBoardNumbers(
        playerBoardNumbers,
        bingoBalls
      );

      playerBoardNumbers.push(randomNumber);
    }
    console.log(`${player.player} Numbers: `, playerBoardNumbers);
  });
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
) {
  playerNumbers = playerNumbers.filter((number) => number != bongoNumber);
  return playerNumbers;
}

function checkIfPlayersHasNumber(bongoNumber: number, players: any[]) {
  players.forEach((player: any) => {
    let playerNumbers = player.numbers;
    console.log(`${player.player}: `, playerNumbers);
    let playerBoardNumbers: number[] = player.numbers;
    if (playerBoardNumbers.includes(bongoNumber)) {
      console.log("Player: ", player.player, "has the number: ", bongoNumber);
      player.numbers = extractPlayerBoardNumber(
        playerBoardNumbers,
        bongoNumber
      );
    }
  });
}

function checkIfPlayersHasWon(players: any[]) {
  let isPlayerWin: boolean = false;
  players.forEach((player: any) => {
    if (player.numbers.length == 0) {
      console.log("Player: ", player.player, "has won!");
      isPlayerWin = true;
    }
  });

  return isPlayerWin;
}

function roundBongoTurn(bongoNumbers: number[]) {
  let bongoNumber = extractBongoBall(bongoNumbers);
  console.log("Extracted ball: ", bongoNumber);
  return bongoNumber;
}

function roundPlayerTurn(
  players: any[],
  bongoNumber: number,
  isPlayerWin: boolean
) {
  checkIfPlayersHasNumber(bongoNumber, players);
  isPlayerWin = checkIfPlayersHasWon(players);

  return isPlayerWin;
}

async function test(
  bongoNumbers: number[],
  players: any[],
  isPlayerWin: boolean,
  round: number
): Promise<any> {
  await setTimeout(function () {
    console.log("--------------------");
    console.log("Round: ", round);
    console.log("--------------------");
    console.log("Balls in Bongo: ", bongoNumbers);
    let bongoNumber = roundBongoTurn(bongoNumbers);
    roundPlayerTurn(players, bongoNumber, isPlayerWin);
  }, 100);
  return [bongoNumbers, isPlayerWin];
}

//TODO : How to use async/await with typescript with delay() like c# script by @LuisLLamas_es
// TDarom
// : las promesas reciben como parámetro una función
// PiterMcFlebor
// : Promise(callback) y al callback le pasa 2 parámetros, resolve y reject, son dos callbacks los cuales te sirven para resolver la promesa
// TDarom
// : dicha función acepta dos parámetros, resolve y reject
// TDarom
// :
// LUL
// TDarom
// : resolve sirve para salir de la promesa de forma exitosa y reject de forma "errónea"
// PiterMcFlebor: setTimeout(callback, ms) ejecuta el callback que le pases en los milisegundos indicados
// new Promise((resolve, reject) => {
// }).then(() => {})

// By: @LuisLLamas_es
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function singBingo(bongoNumbers: number[], players: any[]) {
  console.log("Singing BINGO");
  let isPlayerWin: boolean = false;
  let round: number = 0;

  while (bongoNumbers.length > 0 && !isPlayerWin) {
    console.log("--------------------");
    console.log("Round: ", round);
    console.log("--------------------");
    console.log("Balls in Bongo: ", bongoNumbers);

    let bongoNumber = extractBongoBall(bongoNumbers);
    console.log("Extracted ball: ", bongoNumber);
    checkIfPlayersHasNumber(bongoNumber, players);
    isPlayerWin = checkIfPlayersHasWon(players);

    round++;
    await delay(1000);
  }

  if (isPlayerWin) {
    console.log("BINGO!");
  }
}

function createGame(
  bongoNumbers: number[],
  bingoBalls: number,
  players: any[],
  playerBoardCells: number
) {
  fillBongo(bongoNumbers, bingoBalls);

  for (let index = 0; index < 2; index++) {
    addPlayer(players);
  }

  addPlayersBoardNumber(players, playerBoardCells, bingoBalls);

  // playGameButton(bongoNumbers, players);
  singBingo(bongoNumbers, players);
}

module.exports = { app };
