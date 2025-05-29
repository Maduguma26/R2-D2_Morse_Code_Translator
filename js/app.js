import { encodeToMorse, decodeFromMorse, generateCheatsheet } from './morse-code.js';

// DOM Elements
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const playBtn = document.getElementById('playBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const input = document.getElementById('input');
const output = document.getElementById('output');
const cheatsheet = document.querySelector('.cheatsheet');

let currentMode = 'encode';

// Initialize cheatsheet
cheatsheet.innerHTML = generateCheatsheet();

// Set active button
function setActiveButton(activeBtn) {
    encodeBtn.classList.remove('active');
    decodeBtn.classList.remove('active');
    activeBtn.classList.add('active');
}

// Translate function
function translate() {
    const text = input.value.trim();
    if (!text) {
        output.value = '';
        return;
    }

    try {
        output.value = currentMode === 'encode'
            ? encodeToMorse(text)
            : decodeFromMorse(text);
    } catch (error) {
        output.value = `Error: ${error.message}`;
        console.error(error);
    }
}

// Audio functions
let audioContext;
const beepDuration = 0.1;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeep(frequency, duration, startTime) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

async function playMorse() {
    initAudio();

    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    const morse = currentMode === 'encode' ? output.value : input.value;
    if (!morse) return;

    const dotLength = beepDuration;
    const dashLength = dotLength * 3;
    const spaceLength = dotLength;
    const slashLength = dotLength * 7;

    let time = audioContext.currentTime;

    // Stop any ongoing playback
    if (audioContext.state !== 'closed') {
        await audioContext.close();
    }
    initAudio();

    playBtn.disabled = true;
    playBtn.textContent = 'Playing...';

    try {
        for (const char of morse) {
            switch (char) {
                case '.':
                    playBeep(800, dotLength, time);
                    time += dotLength;
                    break;
                case '-':
                    playBeep(600, dashLength, time);
                    time += dashLength;
                    break;
                case ' ':
                    time += spaceLength;
                    break;
                case '/':
                    time += slashLength;
                    break;
            }

            if (char !== '/' && char !== ' ') {
                time += dotLength;
            }
        }

        // Wait for playback to complete
        await new Promise(resolve => {
            setTimeout(resolve, (time - audioContext.currentTime) * 1000);
        });
    } catch (error) {
        console.error('Playback error:', error);
        output.value = `Audio error: ${error.message}`;
    } finally {
        playBtn.disabled = false;
        playBtn.textContent = 'Play Sound';
    }
}

// Event Listeners
encodeBtn.addEventListener('click', () => {
    currentMode = 'encode';
    setActiveButton(encodeBtn);
    translate();
});

decodeBtn.addEventListener('click', () => {
    currentMode = 'decode';
    setActiveButton(decodeBtn);
    translate();
});

playBtn.addEventListener('click', playMorse);

clearBtn.addEventListener('click', () => {
    input.value = '';
    output.value = '';
});

copyBtn.addEventListener('click', () => {
    output.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = 'Copy to Clipboard';
    }, 2000);
});

input.addEventListener('input', () => {
    if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(translate, 500);
});

// Initialize
setActiveButton(encodeBtn);