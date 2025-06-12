/* This module contains the main game logic functions. */

import { getMathJs, feedback, canvas, gameState } from './game-state.mjs';
import { playCorrectSound, playIncorrectSound, playCoinSound, playMoveSound } from './game-audio.mjs';

export function getRandomNumber(min, max) {
    const math = getMathJs();
    if (!math) {
        console.error("getRandomNumber: Math.js library is not available. Returning 0.");
        return 0; 
    }
    return math.randomInt(min, max + 1);
}

export function createProblem() {
    let op, value;
    gameState.startNumber = gameState.currentNumber; 

    const randomOp = getRandomNumber(0, 1);

    if (gameState.startNumber === 0) {
        op = '+';
        value = getRandomNumber(1, Math.min(5, 10 - gameState.startNumber));
    } else if (gameState.startNumber === 10) {
        op = '-';
        value = getRandomNumber(1, Math.min(5, gameState.startNumber));
    } else {
        op = randomOp === 0 ? '+' : '-';
        
        if (op === '+') {
            value = getRandomNumber(1, Math.min(5, 10 - gameState.startNumber));
        } else {
            value = getRandomNumber(1, Math.min(5, gameState.startNumber));
        }
    }

    if (op === '+') {
        gameState.targetNumber = gameState.startNumber + value; 
    } else {
        gameState.targetNumber = gameState.startNumber - value; 
    }

    gameState.operation = op + value; 
    gameState.selectedNumber = null; 

    feedback.textContent = `Solve: ${gameState.startNumber} ${op} ${value} = ?`;
    feedback.className = 'feedback-box default';
    gameState.box.isPulsing = false;
}

export function moveMario(steps) {
    const newNum = gameState.currentNumber + steps;

    if (newNum < 0 || newNum > 10) {
        feedback.textContent = "You can't leave the number line!";
        feedback.className = 'feedback-box incorrect';
        return;
    }

    playMoveSound();

    gameState.currentNumber = newNum; 
    gameState.marioX = gameState.numberPositions[gameState.currentNumber] - 15;
    gameState.selectedNumber = gameState.currentNumber; 

    if (gameState.targetNumber !== null) {
        const op = gameState.operation[0];
        const val = gameState.operation.substring(1);
        feedback.textContent = `Solve: ${gameState.startNumber} ${op} ${val} = ?`;
        feedback.className = 'feedback-box default';
    }
}

export function checkAnswer() {
    if (gameState.targetNumber === null) {
        feedback.textContent = "Click the ? box first!";
        feedback.className = 'feedback-box incorrect';
        return;
    }

    if (gameState.selectedNumber === null) {
        feedback.textContent = "Use arrow keys to pick a number";
        feedback.className = 'feedback-box incorrect';
        return;
    }

    const op = gameState.operation[0];
    const val = parseInt(gameState.operation.substring(1));

    if (gameState.selectedNumber === gameState.targetNumber) {
        feedback.textContent = `Correct! ${gameState.startNumber} ${op} ${val} = ${gameState.targetNumber}`;
        feedback.className = 'feedback-box correct';
        playCorrectSound();
        playCoinSound();
        showCoin();
        gameState.targetNumber = null;
        gameState.box.isPulsing = true;
    } else {
        feedback.textContent = `Incorrect. Answer: ${gameState.startNumber} ${op} ${val} = ${gameState.targetNumber}`;
        feedback.className = 'feedback-box incorrect';
        playIncorrectSound();
        gameState.box.isPulsing = true;
    }
}

export function showCoin() {
    gameState.coin.x = gameState.marioX + 5;
    gameState.coin.y = (canvas.height / 2) - 60;
    gameState.coin.show = true;
    gameState.coin.frames = 0;
}
