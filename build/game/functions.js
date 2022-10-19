"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPlayersBoardNumber = exports.fillBongo = void 0;
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
