/* This module centralizes all game state variables and DOM elements. */

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
export const feedback = document.getElementById('feedback');

canvas.width = 800;
canvas.height = 250;

export const marioImg = new Image();
export const boxImg = new Image();
export const coinImg = new Image();

export const gameState = {
    marioX: 50,
    currentNumber: 0,
    startNumber: 0,
    targetNumber: null,
    operation: "",
    selectedNumber: null,
    imagesLoaded: false,
    numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    numberPositions: {},

    box: {
        x: canvas.width - 100,
        y: 30,
        width: 50,
        height: 50,
        hit: false,
        bounce: 0,
        isPulsing: true
    },
    coin: {
        x: 0,
        y: 0,
        width: 30,
        height: 30,
        show: false,
        frames: 0,
        maxFrames: 30
    }
};

export function getMathJs() {
    if (typeof math === 'undefined') {
        console.error("Error: Math.js library is not globally loaded.");
        return null;
    }
    return math;
}