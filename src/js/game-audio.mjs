/* This module manages sound effects for the game.
It uses Tone.js for sounds and Web Speech API for text-to-speech. */

// Declare synth as a mutable variable, it will be initialized later
let synth = null;

// Initialize the SpeechSynthesis API
const speechSynth = window.speechSynthesis;
let voice = null;

function loadSpanishVoice() {
    const voices = speechSynth.getVoices();
    voice = voices.find(v => v.lang.startsWith('es')) || voices.find(v => v.lang === 'es-ES') || voices[0];
}

// Load voices as soon as they are available 
if (speechSynth.onvoiceschanged !== undefined) {
    speechSynth.onvoiceschanged = loadSpanishVoice;
} else {
    // Fallback for browsers that don't fire onvoiceschanged
    loadSpanishVoice();
}

/* It starts the special audio system in the web browser*/
export function initializeAudioContext() {
    if (!synth) { // Only create the synth if it hasn't been created yet
        synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: "triangle"
            },
            envelope: {
                attack: 0.005,
                decay: 0.1,
                sustain: 0.05,
                release: 0.2
            }
        }).toDestination();
        console.log("Tone.PolySynth initialized.");
    }

    if (Tone.context.state !== 'running') {
        Tone.start()
            .then(() => console.log("Tone.js audio context started/resumed."))
            .catch(e => console.error("Error starting Tone.js context:", e));
    }
}

export function playCorrectSound() {
    if (!synth) { console.warn("Synth not initialized for playCorrectSound."); return; }
    synth.triggerAttackRelease("C5", "8n");
}

export function playIncorrectSound() {
    if (!synth) { console.warn("Synth not initialized for playIncorrectSound."); return; }
    synth.triggerAttackRelease("A2", "32n", Tone.now(), 1);
}

export function playCoinSound() {
    if (!synth) { console.warn("Synth not initialized for playCoinSound."); return; }
    const now = Tone.now();
    synth.triggerAttackRelease("G5", "32n", now);
    synth.triggerAttackRelease("C6", "32n", now + 0.07);
}

export function playMoveSound() {
    if (!synth) { console.warn("Synth not initialized for playMoveSound."); return; }
    synth.triggerAttackRelease("E4", "16n");
}

export function playBellSound() {
    if (!synth) { console.warn("Synth not initialized for playBellSound."); return; }
    synth.triggerAttackRelease("A4", "8n");
}

export function speakText(textToSpeak, lang = 'es') {
    if (!speechSynth) {
        console.warn("SpeechSynthesis not supported.");
        return;
    }

    // Ensure audio context is started before speaking, as TTS might also need it
    initializeAudioContext();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    
    if (voice) {
        utterance.voice = voice;
    } else {
        loadSpanishVoice(); // Try loading again in case it wasn't ready
        utterance.voice = voice;
    }

    speechSynth.cancel();
    speechSynth.speak(utterance);
}
