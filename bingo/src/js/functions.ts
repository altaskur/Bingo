function generateRandomNumber() {
  // TODO: why cant use * 90 here?
  return Math.floor(Math.random() * 99);
}

function addBongoNumber(bongoNumbers: number[]) {
  let randomNumber = generateRandomNumber();
  bongoNumbers.includes(randomNumber) && bongoNumbers.length <= 90
    ? addBongoNumber(bongoNumbers)
    : bongoNumbers.push(randomNumber);
}

export function fillBongo(bongoNumbers: number[]) {
  for (let i = 0; i < 99; i++) {
    addBongoNumber(bongoNumbers);
  }
  console.log("Números cargados en el bongo!", bongoNumbers);
}

function checkBoardCells() {
  let boardCells = <NodeList>(
    document.querySelectorAll("tbody td input[type=text]")
  );
  let bongoBoardEmpty: boolean = false;

  boardCells.forEach((cell) => {
    // TODO: Whats out for this
    // TODO: How to assign a type to cell

    let cellContent: string | null = cell.value;
    console.log(cellContent);
    // check if cellcontent is a number

    //cellContent.match(/^[0-9]+$/)
    if (
      cellContent == null ||
      cellContent == "" ||
      cellContent == " " ||
      isNaN(parseInt(cellContent))
    ) {
      bongoBoardEmpty = true;
    }
  });
  console.log("Bingo Board empty?: ", bongoBoardEmpty);
  return bongoBoardEmpty;
}

function blockBoard() {
  let boardCells = <NodeList>(
    document.querySelectorAll("tbody td input[type=text]")
  );
  boardCells.forEach((cell) => {
    cell.setAttribute("disabled", "true");
  });
}

function singBingo(bongoNumbers: number[]) {
  let randomNumber = generateRandomNumber();

  if (randomNumber > bongoNumbers.length) {
    randomNumber = generateRandomNumber();
  } else {
    let bongoNumber = bongoNumbers[randomNumber];
    bongoNumbers.splice(randomNumber, 1);

    console.log(bongoNumbers);
    console.log("Bongo Number: ", bongoNumber);
  }

  console.log("randomNumber: ", randomNumber);
}

export function playGame(bongoNumbers: number[]) {
  let startButton = <HTMLButtonElement>document.querySelector("button");
  startButton.addEventListener("click", () => {
    console.log("Start button clicked!");
    let bongoBoardEmpty = checkBoardCells();

    if (!bongoBoardEmpty) {
      blockBoard();
      singBingo(bongoNumbers);
    }
  });
}
