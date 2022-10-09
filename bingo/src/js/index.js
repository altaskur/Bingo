viewedNumbers = [];

function generateNumber() {
  let number = Math.floor(Math.random() * 99);
  viewedNumbers.filter((item) => {
    return item === number;
  }).length === 0
    ? viewedNumbers.push(number)
    : generateNumber();
}

function createBingoNumbers() {
  while (viewedNumbers.length < 99) {
    generateNumber(viewedNumbers);
  }
}

function checkBingoNumbers() {
  setInterval(() => {
    showBingoNumbers();
  }, 1000);
}

function showBingoNumbers() {
  let boardCell = document.querySelectorAll("input[type=text]");
  // let number = viewedNumbers.shift();

  let numeroAleatorio = Math.round(Math.random() * 99);
  viewedNumbers = viewedNumbers.filter((item) => item != numeroAleatorio);
  // numeroAleatorio > viewedNumbers ? viewedNumbers.length
  let number = viewedNumbers[numeroAleatorio];

  boardCell.forEach((cell, index) => {
    bingoCell = cell.value;
    let tableHeader = document.querySelector("thead").querySelector("td");
    tableHeader.textContent = " Numero del bingo! " + number;

    console.log("Bingo number: " + number + "vs " + bingoCell);
    if (bingoCell == number) {
      tableHeader.textContent = " BINGO! " + number;
      cell.classList.add("ux-hidden");
    }
  });
}
function addNumbersToBoard() {
  let boardCell = document.querySelectorAll("input[type=text]");

  boardCell.forEach((cell, index) => {
    cell.value = viewedNumbers[index];
  });
}

createBingoNumbers();
addNumbersToBoard();

console.log("Bingo numbers: ", viewedNumbers);

let bingoStartButton = document.querySelector("button");

bingoStartButton.addEventListener("click", () => {
  checkBingoNumbers();
});
