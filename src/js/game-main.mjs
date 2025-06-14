/*This module orchestrates the main game loop, asset loading, and event handling. */

import { canvas, ctx, feedback, marioImg, boxImg, coinImg, getMathJs, gameState, initializeCanvasAndBoxDimensions } from './game-state.mjs';
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
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoved = false;

    canvas.addEventListener('click', (e) => {
        initializeAudioContext();

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        if (clickX >= gameState.box.x &&
            clickX <= gameState.box.x + gameState.box.width &&
            clickY >= gameState.box.y &&
            clickY <= gameState.box.y + gameState.box.height) {

            gameState.box.hit = true;
            playBellSound();

            setTimeout(function () {
                gameState.box.hit = false;
                createProblem();
            }, 400);
        } else {
            checkAnswer();
        }
    });

    canvas.addEventListener('touchstart', (e) => {
        initializeAudioContext();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        touchMoved = true;
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        const minSwipeDistance = 50;
        const maxVerticalDeviation = 50;

        if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < maxVerticalDeviation) {
            if (deltaX > 0) {
                moveMario(1);
            } else {
                moveMario(-1);
            }
        } else if (!touchMoved) {
            const rect = canvas.getBoundingClientRect();
            const relativeTapX = touchEndX - rect.left;
            const relativeTapY = touchEndY - rect.top;

            if (relativeTapX >= gameState.box.x &&
                relativeTapX <= gameState.box.x + gameState.box.width &&
                relativeTapY >= gameState.box.y &&
                relativeTapY <= gameState.box.y + gameState.box.height) {

                gameState.box.hit = true;
                playBellSound();

                setTimeout(function () {
                    gameState.box.hit = false;
                    createProblem();
                }, 400);
            } else {
                checkAnswer();
            }
        }
        touchMoved = false;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('keydown', function (e) {
        initializeAudioContext();

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            moveMario(1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            moveMario(-1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
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
        feedback.textContent = "Error: The Math.js library failed to load.";
        feedback.className = 'feedback-box incorrect';
        return;
    }

    feedback.textContent = "Loading game...";
    feedback.className = 'feedback-box loading-message';

    initializeCanvasAndBoxDimensions();

    loadImages().then(function() {
        setupEvents();

        const startXNumbers = 25;
        const endXNumbers = canvas.width - 15;
        const totalSpaceNumbers = endXNumbers - startXNumbers;
        const spaceBetweenNumbers = totalSpaceNumbers / (gameState.numbers.length - 1);

        // console.log(`DEBUG: startXNumbers: ${startXNumbers}`);
        // console.log(`DEBUG: endXNumbers: ${endXNumbers}`);
        // console.log(`DEBUG: totalSpaceNumbers: ${totalSpaceNumbers}`);
        // console.log(`DEBUG: spaceBetweenNumbers: ${spaceBetweenNumbers}`);
        // console.log(`DEBUG: Number of numbers: ${gameState.numbers.length}`);


        for (let i = 0; i < gameState.numbers.length; i++) {
            const number = gameState.numbers[i];
            const position = startXNumbers + (i * spaceBetweenNumbers);
            gameState.numberPositions[number] = position;
            console.log(`DEBUG: Number ${number} position: ${position}`);
        }

        if (gameState.numbers.length > 0 && gameState.numberPositions[gameState.numbers[0]] !== undefined) {
            gameState.currentNumber = gameState.numbers[0];
            
            gameState.marioX = gameState.numberPositions[gameState.currentNumber] - (gameState.marioDesiredWidth / 2);
            // console.log(`DEBUG: Mario initial X calculated: ${gameState.marioX}`);
            // console.log(`DEBUG: Mario Width used for calculation: ${gameState.marioDesiredWidth}`);
        } else {
            gameState.marioX = 50;
            gameState.currentNumber = 0;
            console.warn("Could not set initial MarioX based on number positions. Falling back to 50.");
        }

        feedback.textContent = "Click on the box with the '?' to start!";
        feedback.className = 'feedback-box default';

        gameLoop();
    }).catch(function(error) {
        feedback.textContent = "Error loading the game.";
        feedback.className = 'feedback-box incorrect';
        console.error("Error starting the game:", error);
    });
}