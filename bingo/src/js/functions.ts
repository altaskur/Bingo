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

function extractBongoBall(bongoNumbers: number[]): number {
  let randomNumber = generateRandomNumber(bongoNumbers.length);
  let bongoNumber = bongoNumbers[randomNumber];
  bongoNumbers.splice(randomNumber, 1);

  return bongoNumber;
}

function disablePlayerBoardNumber(
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
      player.numbers = disablePlayerBoardNumber(
        playerBoardNumbers,
        bongoNumber
      );
    }
  });
}

function checkIfPlayersHasWon(players: any[]) {
  let test: boolean = false;
  players.forEach((player: any) => {
    if (player.numbers.length == 0) {
      console.log("Player: ", player.player, "has won!");
      test = true;
    }
  });

  return test;
}

function singBingo(bongoNumbers: number[], players: any[]) {
  console.log("Singing BINGO");
  let isPlayerWin: boolean = false;
  let round: number = 0;
  while (bongoNumbers.length > 0 && isPlayerWin == false) {
    round++;
    console.log("--------------------");
    console.log("Round: ", round);
    console.log("--------------------");
    console.log("Balls in Bongo: ", bongoNumbers);

    let bongoNumber = extractBongoBall(bongoNumbers);
    console.log("Extracted ball: ", bongoNumber);
    checkIfPlayersHasNumber(bongoNumber, players);
    isPlayerWin = checkIfPlayersHasWon(players);
  }

  if (isPlayerWin != true) {
    console.log("Machine won the game!");
  }
}

export function createGame(
  bongoNumbers: number[],
  bingoBalls: number,
  players: any[],
  playerBoardCells: number
) {
  fillBongo(bongoNumbers, bingoBalls);
  for (let index = 0; index < 20; index++) {
    addPlayer(players);
  }
  addPlayersBoardNumber(players, playerBoardCells, bingoBalls);

  playGameButton(bongoNumbers, players);
}

function playGameButton(bongoNumbers: number[], players: any[]) {
  let startButton = <HTMLButtonElement>document.querySelector("button");
  startButton.addEventListener("click", () => {
    console.log("Start button clicked!");
    singBingo(bongoNumbers, players);
  });
}
