/*This module manages sound effects for the game. 
It uses Tone.js to make sounds.*/

const synth = new Tone.PolySynth(Tone.Synth, {
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

export function playCorrectSound() {
    // Play a "C" note (C5) for a short time (an "8th note")
    synth.triggerAttackRelease("C5", "8n"); 
}

export function playIncorrectSound() {
   
    synth.triggerAttackRelease("C4", "16n", Tone.now(), 1);
}

export function playCoinSound() {
    // Play a "G" note (G5) then a slightly higher "C" note (C6) very quickly after
    const now = Tone.now(); 
    synth.triggerAttackRelease("G5", "32n", now); 
    synth.triggerAttackRelease("C6", "32n", now + 0.07); 
}

export function playMoveSound() {
    // Play an "E" note (E4) for a short time
    synth.triggerAttackRelease("E4", "16n"); 
}


export function playBellSound() {
   // Play an A note (A4) for a short time
    synth.triggerAttackRelease("A4", "8n"); 
}

/* It starts the special audio system in the web browser*/
export function initializeAudioContext() {
    if (Tone.context.state !== 'running') {
        Tone.start(); 
    }
}

