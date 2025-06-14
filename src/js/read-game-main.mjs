/* This module contains the main logic for the "Learn to Read" game.*/

import { initializeAudioContext, playCorrectSound, playIncorrectSound, speakText } from './game-audio.mjs';

const feedback = document.getElementById('read-feedback');
const startBtn = document.getElementById('start-read-game-btn');
const targetWordEl = document.getElementById('target-word');
const questionImageEl = document.getElementById('question-image');
const playAudioBtn = document.getElementById('play-audio-btn');
const optionsArea = document.getElementById('options-area');

let questions = [];
let currentQ = null;

/*Loads game questions from a JSON file*/
async function getQuestions() {
    try {
        const response = await fetch('/json/reading_questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        questions = await response.json();
        feedback.textContent = "Questions ready! Click START GAME.";
        feedback.className = 'feedback-box default';
        startBtn.disabled = false;
    } catch (error) {
        feedback.textContent = "Error loading questions.";
        feedback.className = 'feedback-box incorrect';
        startBtn.disabled = true;
        console.error("Fetch error:", error);
    }
}

/*Displays a random question in the game interface.*/
function showRandomQuestion() {
    if (questions.length === 0) {
        feedback.textContent = "No questions found.";
        feedback.className = 'feedback-box incorrect';
        return;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQ = questions[randomIndex];
    
    optionsArea.innerHTML = '';
    questionImageEl.classList.add('hidden');

    feedback.textContent = currentQ.question_text || "What does it say?";
    feedback.className = 'feedback-box default';
    targetWordEl.textContent = ''; 

    if (currentQ.image_asset) {
        questionImageEl.src = currentQ.image_asset;
        questionImageEl.alt = currentQ.correct_answer;
        questionImageEl.classList.remove('hidden');
    }
    
    playAudioBtn.classList.remove('hidden');

    const optionsToUse = currentQ.options || [currentQ.correct_answer];
    optionsToUse.forEach(option => {
        const btn = document.createElement('button');
        btn.classList.add('option-button');
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(option));
        optionsArea.appendChild(btn);
    });
}

/**
Checks if the user's selected option is correct.
 * @param {string} selectedOption - The option chosen by the user.*/
function checkAnswer(selectedOption) {
    initializeAudioContext();

    if (selectedOption === currentQ.correct_answer) {
        feedback.textContent = currentQ.feedback_correct_text || "Correct!";
        feedback.className = 'feedback-box correct';
        playCorrectSound();
        setTimeout(showRandomQuestion, 1500);
    } else {
        feedback.textContent = currentQ.feedback_incorrect_text || "Incorrect. Try again!";
        feedback.className = 'feedback-box incorrect';
        playIncorrectSound();
    }
}

/*Event listener for the audio button.Plays the target word using text-to-speech.*/
playAudioBtn.addEventListener('click', () => {
    if (currentQ && currentQ.correct_answer) {
        initializeAudioContext();
        speakText(currentQ.correct_answer, currentQ.language || 'es'); 
    }
});

/*Initializes and starts the "Learn to Read" game*/
export function startReadingGame() {
    initializeAudioContext();
    feedback.textContent = "Game starting...";
    feedback.className = 'feedback-box default';
    
    showRandomQuestion();
    startBtn.textContent = "START GAME";
    startBtn.removeEventListener('click', startReadingGame);
    startBtn.addEventListener('click', showRandomQuestion);
}

getQuestions();

startBtn.addEventListener('click', startReadingGame);