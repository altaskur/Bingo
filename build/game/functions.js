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
exports.singBingo = exports.addPlayersBoardNumber = exports.fillBongo = void 0;
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
exports.fillBongo = fillBongo;
function generatePlayerBoardNumbers(playerNumbers, limitOfNumbers) {
    let randomNumber = generateRandomNumber(limitOfNumbers);
    if (playerNumbers.includes(randomNumber) &&
        playerNumbers.length < limitOfNumbers) {
        return generatePlayerBoardNumbers(playerNumbers, limitOfNumbers);
    }
    return randomNumber;
}
function addPlayersBoardNumber(playerBoardCells, bongoNumbers, playerBoardNumbers) {
    while (playerBoardNumbers.length < playerBoardCells) {
        let randomNumber = generatePlayerBoardNumbers(playerBoardNumbers, bongoNumbers);
        playerBoardNumbers.push(randomNumber);
    }
    console.log("Player board numbers", playerBoardNumbers);
}
exports.addPlayersBoardNumber = addPlayersBoardNumber;
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
        let playerNumbers = player.boardNumbers;
        console.log(`${player.ip}: `, playerNumbers);
        console.log("player", player);
        console.log("playerNumbers", player.boardNumbers);
        let playerBoardNumbers = player.boardNumbers;
        if (playerBoardNumbers.includes(bongoNumber)) {
            console.log("Player: ", player.ip, "has the number: ", bongoNumber);
            player.boardNumbers = extractPlayerBoardNumber(playerBoardNumbers, bongoNumber);
        }
    });
}
function checkIfPlayersHasWon(players) {
    let isPlayerWin = false;
    players.forEach((player) => {
        if (player.boardNumbers.length == 0) {
            console.log("Player: ", player.ip, "has won!");
            isPlayerWin = true;
        }
    });
    return isPlayerWin;
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function singBingo(bongoNumbers, players, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        let isPlayerWin = false;
        let round = 0;
        while (bongoNumbers.length > 0 && !isPlayerWin) {
            let bongoNumber = extractBongoBall(bongoNumbers);
            checkIfPlayersHasNumber(bongoNumber, players);
            isPlayerWin = checkIfPlayersHasWon(players);
            let roundData = {
                bongoNumber: bongoNumber,
                checkIfPlayersHasNumber: players,
                isPlayerWin: isPlayerWin,
            };
            socket.emit("round", roundData);
            round++;
            yield delay(1000);
        }
        if (isPlayerWin) {
            console.log("BINGO!");
        }
    });
}
exports.singBingo = singBingo;
