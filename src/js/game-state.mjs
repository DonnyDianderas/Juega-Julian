/* This module centralizes all game state variables and DOM elements. */

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
export const feedback = document.getElementById('feedback');

export const marioImg = new Image();
export const boxImg = new Image();
export const coinImg = new Image();

export function getMathJs() {
    return typeof math !== 'undefined' ? math : null;
}

export const gameState = {
    marioX: 0,
    marioY: 0,
    marioSpeed: 10,
    currentProblem: "",
    correctAnswer: 0,
    currentNumber: 0,
    numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    numberPositions: {},
    imagesLoaded: false,
    box: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        bounce: 0,
        hit: false,
        isPulsing: false
    },
    coin: {
        x: 0,
        y: 0,
        show: false,
        frames: 0,
        maxFrames: 30
    },
    operation: '',
    targetNumber: null,
    selectedNumber: null,
    marioDesiredWidth: 50 
};

export function initializeCanvasAndBoxDimensions() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.width * (0.4);

    if (canvas.height < 300) canvas.height = 300;
    if (canvas.height > 400) canvas.height = 400;

    const minBoxSize = 70;
    const maxBoxSize = 110;
    const responsiveBoxSize = canvas.width * 0.2;

    gameState.box.width = Math.max(minBoxSize, Math.min(maxBoxSize, responsiveBoxSize));
    gameState.box.height = gameState.box.width;

    gameState.box.y = canvas.height * 0.02 ;
    gameState.box.x = canvas.height * 0.65 ;

    gameState.marioY = (canvas.height / 2.2) - 30;

    // console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    // console.log(`Box dimensions: ${gameState.box.width}x${gameState.box.height} at y:${gameState.box.y}`);
    // console.log(`Mario base Y position: ${gameState.marioY}`);
    // console.log(`DEBUG: Final Canvas Width in gameState: ${canvas.width}`);
}