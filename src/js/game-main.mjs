/*This module orchestrates the main game loop, asset loading, and event handling. */

import { canvas, ctx, feedback, marioImg, boxImg, coinImg, getMathJs, gameState} from './game-state.mjs';
import { drawNumbers, drawMario, drawBox, drawCoin } from './game-drawing.mjs';
import { createProblem, moveMario, checkAnswer } from './game-logic.mjs';
import { initializeAudioContext, playBellSound } from './game-audio.mjs';

function loadImages() {
    const images = [
        { img: marioImg, src: '/images/mario.webp' },
        { img: boxImg, src: '/images/box.webp' },
        { img: coinImg, src: '/images/coin.webp' }
    ];

    const promises = images.map(function(image) {
        return new Promise(function(resolve) {
            image.img.onload = function() {
                resolve();
            };
            image.img.onerror = function() {
                console.error('Error loading image:', image.src);
                resolve(); 
            };
            image.img.src = image.src;
        });
    });

    return Promise.all(promises).then(function() {
        gameState.imagesLoaded = true;
    });
}

function setupEvents() {
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        if (clickX >= gameState.box.x &&
            clickX <= gameState.box.x + gameState.box.width &&
            clickY >= gameState.box.y + gameState.box.bounce && 
            clickY <= gameState.box.y + gameState.box.height + gameState.box.bounce) {

            gameState.box.hit = true;
            playBellSound();

            setTimeout(function () {
                gameState.box.hit = false;  
                createProblem();
            }, 400);
        }
    });

    document.addEventListener('keydown', function (e) {

        initializeAudioContext();

        if (e.key === 'ArrowRight') {
            moveMario(1);
        } else if (e.key === 'ArrowLeft') {
            moveMario(-1);
        } else if (e.key === 'Enter') {
            checkAnswer();
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNumbers();
    drawBox();
    drawMario();
    drawCoin();
    requestAnimationFrame(gameLoop);
}

export function startGame() {
    if (getMathJs() === null) {
        feedback.textContent = "Error: Math.js library not loaded. Please try again!";
        feedback.className = 'feedback-box incorrect';
        return;
    }

    feedback.textContent = "Loading game...";
    feedback.className = 'feedback-box loading-message';

    loadImages().then(function() {
        setupEvents();

        const totalSpace = canvas.width - 100;
        const spaceBetweenNumbers = totalSpace / (gameState.numbers.length - 1);

        for (let i = 0; i < gameState.numbers.length; i++) {
            const number = gameState.numbers[i];
            const position = 50 + (i * spaceBetweenNumbers);
            gameState.numberPositions[number] = position;
        }

        gameState.marioX = gameState.numberPositions[gameState.currentNumber] - 15;

        feedback.textContent = "Click the ? box to start!";
        feedback.className = 'feedback-box default';

        gameLoop();
    }).catch(function(error) {
        feedback.textContent = "Error loading game. Please try refreshing the page!";
        feedback.className = 'feedback-box incorrect';
        console.error("Game start error:", error);
    });
}