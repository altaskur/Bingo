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
const socket_1 = require("../socket/socket");
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
function addPlayersBoardNumber(playerBoardCells, bongoNumbers) {
    let playerBoardNumbers = [];
    while (playerBoardNumbers.length < playerBoardCells) {
        let randomNumber = generatePlayerBoardNumbers(playerBoardNumbers, bongoNumbers);
        playerBoardNumbers.push(randomNumber);
    }
    return playerBoardNumbers;
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
    let playersHasNumber = [];
    players.forEach((player) => {
        let playerNumbers = player.boardNumbers;
        console.log(`${player.nickname}: `, playerNumbers);
        console.log("player", player);
        console.log("playerNumbers", player.boardNumbers);
        let playerBoardNumbers = player.boardNumbers;
        if (playerBoardNumbers.includes(bongoNumber)) {
            console.log("Player: ", player.nickname, "has the number: ", bongoNumber);
            playersHasNumber.push(player.nickname);
            player.boardNumbers = extractPlayerBoardNumber(playerBoardNumbers, bongoNumber);
        }
    });
    return playersHasNumber;
}
function checkIfPlayersHasWon(players) {
    let isPlayerWin = {
        hasWon: false,
        players: [],
    };
    players.forEach((player) => {
        if (player.boardNumbers.length == 0) {
            console.log("Player: ", player.nickname, "has won!");
            isPlayerWin.hasWon = true;
            isPlayerWin.players.push(player.nickname);
        }
    });
    return isPlayerWin;
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function singBingo(bongoNumbers, players, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        let isPlayerWin = {
            hasWon: false,
            players: [],
        };
        let playerHasNumber = [];
        let round = 0;
        while (bongoNumbers.length > 0 && !isPlayerWin.hasWon) {
            let bongoNumber = extractBongoBall(bongoNumbers);
            playerHasNumber = checkIfPlayersHasNumber(bongoNumber, players);
            isPlayerWin = checkIfPlayersHasWon(players);
            let roundData = {
                round: round,
                bongoNumber: bongoNumber,
                playersHasNumber: playerHasNumber,
            };
            socket_1.io.emit("round", roundData);
            round++;
            yield delay(1000);
        }
        if (isPlayerWin.hasWon) {
            console.log("BINGO!");
            socket.emit("endGame", isPlayerWin.players);
        }
        else if (bongoNumbers.length == 0) {
            socket.emit("endGame", isPlayerWin.players.push("Machine"));
        }
    });
}
exports.singBingo = singBingo;
