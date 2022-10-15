"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = exports.runGame = void 0;
function generateRandomNumber(bingoBalls) {
    return Math.floor(Math.random() * bingoBalls);
}
function generateBongoNumber(bongoNumbers, bingoBalls) {
    let randomNumber = generateRandomNumber(bingoBalls);
    if (bongoNumbers.includes(randomNumber)) {
        return generateBongoNumber(bongoNumbers, bingoBalls);
    }
    else {
        return randomNumber;
    }
}
function fillBongo(bongoNumbers, bingoBalls) {
    while (bongoNumbers.length < bingoBalls) {
        let randomNumber = generateBongoNumber(bongoNumbers, bingoBalls);
        bongoNumbers.push(randomNumber);
    }
    console.log("Numbers in to de Bongo", bongoNumbers);
}
function addPlayer(players) {
    let playerPosition = players.length + 1;
    players.push({ player: `Player ${playerPosition}`, numbers: [] });
}
function generatePlayerBoardNumbers(playerNumbers, limitOfNumbers) {
    let randomNumber = generateRandomNumber(limitOfNumbers);
    if (playerNumbers.includes(randomNumber) &&
        playerNumbers.length < limitOfNumbers) {
        return generatePlayerBoardNumbers(playerNumbers, limitOfNumbers);
    }
    return randomNumber;
}
function addPlayersBoardNumber(players, playerBoardCells, bingoBalls) {
    players.forEach((player) => {
        let playerBoardNumbers = player.numbers;
        while (playerBoardNumbers.length <= playerBoardCells) {
            let randomNumber = generatePlayerBoardNumbers(playerBoardNumbers, bingoBalls);
            playerBoardNumbers.push(randomNumber);
        }
        console.log(`${player.player} Numbers: `, playerBoardNumbers);
    });
}
function extractBongoBall(bongoNumbers) {
    let randomNumber = generateRandomNumber(bongoNumbers.length);
    let bongoNumber = bongoNumbers[randomNumber];
    bongoNumbers.splice(randomNumber, 1);
    return bongoNumber;
}
function extractPlayerBoardNumber(playerNumbers, bongoNumber) {
    playerNumbers = playerNumbers.filter((number) => number != bongoNumber);
    return playerNumbers;
}
function checkIfPlayersHasNumber(bongoNumber, players) {
    players.forEach((player) => {
        let playerNumbers = player.numbers;
        console.log(`${player.player}: `, playerNumbers);
        let playerBoardNumbers = player.numbers;
        if (playerBoardNumbers.includes(bongoNumber)) {
            console.log("Player: ", player.player, "has the number: ", bongoNumber);
            player.numbers = extractPlayerBoardNumber(playerBoardNumbers, bongoNumber);
        }
    });
}
function checkIfPlayersHasWon(players) {
    let isPlayerWin = false;
    players.forEach((player) => {
        if (player.numbers.length == 0) {
            console.log("Player: ", player.player, "has won!");
            isPlayerWin = true;
        }
    });
    return isPlayerWin;
}
function roundBongoTurn(bongoNumbers) {
    let bongoNumber = extractBongoBall(bongoNumbers);
    console.log("Extracted ball: ", bongoNumber);
    return bongoNumber;
}
function roundPlayerTurn(players, bongoNumber, isPlayerWin) {
    checkIfPlayersHasNumber(bongoNumber, players);
    isPlayerWin = checkIfPlayersHasWon(players);
    return isPlayerWin;
}
function runGame(bongoNumbers, players, isPlayerWin, round) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setTimeout(function () {
            console.log("--------------------");
            console.log("Round: ", round);
            console.log("--------------------");
            console.log("Balls in Bongo: ", bongoNumbers);
            let bongoNumber = roundBongoTurn(bongoNumbers);
            roundPlayerTurn(players, bongoNumber, isPlayerWin);
        }, 100);
        return [bongoNumbers, isPlayerWin];
    });
}
exports.runGame = runGame;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function singBingo(bongoNumbers, players) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Singing BINGO");
        let isPlayerWin = false;
        let round = 0;
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
            yield delay(1000);
        }
        if (isPlayerWin) {
            console.log("BINGO!");
        }
    });
}
function createGame(bongoNumbers, bingoBalls, players, playerBoardCells) {
    fillBongo(bongoNumbers, bingoBalls);
    for (let index = 0; index < 2; index++) {
        addPlayer(players);
    }
    addPlayersBoardNumber(players, playerBoardCells, bingoBalls);
    singBingo(bongoNumbers, players);
}
exports.createGame = createGame;
