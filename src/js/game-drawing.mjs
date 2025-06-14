/* This module contains all functions responsible for drawing game elements.*/

import { ctx, marioImg, boxImg, coinImg, gameState } from './game-state.mjs';

export function drawNumbers() {
    const startX = 15;
    const endX = ctx.canvas.width - 15;
    const lineY = ctx.canvas.height / 2 + 20;

    ctx.beginPath();
    ctx.moveTo(startX, lineY);
    ctx.lineTo(endX, lineY);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();

    const space = (endX - startX) / (gameState.numbers.length - 1);

    gameState.numbers.forEach((num, i) => {
        const x = startX + (i * space);
        gameState.numberPositions[num] = x;

        let color = '#000000';
        let size = 20;

        if (gameState.currentNumber === num) {
            color = '#f39c12';
            size = 20;
        }

        if (gameState.targetNumber !== null && num === gameState.targetNumber) {
            color = '#2ecc71';
            size = 22;
        }

        if (gameState.selectedNumber !== null && num === gameState.selectedNumber) {
            color = '#3498db';
            size = 22;
        }

        ctx.font = size + 'px Arial';
        ctx.fillStyle = color;
        ctx.fillText(num.toString(), x - (num < 10 ? 5 : 8), lineY + 30);
    });
}

export function drawMario() {
    if (!gameState.imagesLoaded || !marioImg.complete) return;

    const marioYWithBounce = gameState.marioY + (Math.sin(Date.now() / 200) * 5);
    ctx.drawImage(marioImg, gameState.marioX, marioYWithBounce, 50, 65);
}

export function drawBox() {
    if (!gameState.imagesLoaded || !boxImg.complete) return;

    const boxY = gameState.box.y + (Math.sin(Date.now() / 300) * 5);
    ctx.drawImage(boxImg, gameState.box.x, boxY, gameState.box.width, gameState.box.height);

    if (gameState.box.hit) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.fillRect(gameState.box.x - 5, boxY - 5, gameState.box.width + 10, gameState.box.height + 10);
    }
}

export function drawCoin() {
    if (!gameState.coin.show || !gameState.imagesLoaded || !coinImg.complete) return;

    gameState.coin.frames++;
    if (gameState.coin.frames > gameState.coin.maxFrames) {
        gameState.coin.show = false;
        return;
    }

    const coinY = gameState.coin.y - (gameState.coin.frames * 2);
    ctx.drawImage(coinImg, gameState.coin.x, coinY, gameState.coin.width, gameState.coin.height);
}