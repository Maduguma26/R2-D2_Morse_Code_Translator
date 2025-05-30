// Use window object instead of import
const { encodeToMorse, decodeFromMorse, generateCheatsheet } = window.morseCodeFunctions;

// DOM Elements
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const playBtn = document.getElementById('playBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const input = document.getElementById('input');
const output = document.getElementById('output');
const cheatsheet = document.querySelector('.cheatsheet');

// Application state
let currentMode = 'encode';
let isPlaying = false;
let playTimeout = null;
let activeSound = null;

// Audio element
const dotSound = new Audio('./sounds/dot.mp3');

// Initialize the application
function init() {
    cheatsheet.innerHTML = generateCheatsheet();
    dotSound.load(); // Preload sound
    setActiveButton(encodeBtn);
    setupEventListeners();
}

function setActiveButton(activeBtn) {
    encodeBtn.classList.remove('active');
    decodeBtn.classList.remove('active');
    activeBtn.classList.add('active');
}

function setupEventListeners() {
    encodeBtn.addEventListener('click', handleEncode);
    decodeBtn.addEventListener('click', handleDecode);
    playBtn.addEventListener('click', togglePlayback);
    clearBtn.addEventListener('click', handleClear);
    copyBtn.addEventListener('click', handleCopy);

    // Removed automatic translation on input
    // input.addEventListener('input', debounce(handleInput, 300));
}

// Translation functions - now only on button click
function handleEncode() {
    currentMode = 'encode';
    setActiveButton(encodeBtn);
    translate();
}

function handleDecode() {
    currentMode = 'decode';
    setActiveButton(decodeBtn);
    translate();
}

function translate() {
    const text = input.value.trim();
    output.value = text ?
        (currentMode === 'encode' ? encodeToMorse(text) : decodeFromMorse(text))
        : '';
}

// Playback control functions
function togglePlayback() {
    if (isPlaying) {
        stopPlayback();
    } else {
        startPlayback();
    }
}

function startPlayback() {
    const morse = currentMode === 'encode' ? output.value : input.value;
    if (!morse.trim()) return;

    isPlaying = true;
    playBtn.textContent = 'Stop';
    playMorseSequence(morse);
}

function stopPlayback() {
    isPlaying = false;
    clearTimeout(playTimeout);
    if (activeSound) {
        activeSound.pause();
        activeSound.currentTime = 0;
        activeSound = null;
    }
    playBtn.textContent = 'Play Sound';
}

async function playMorseSequence(morse) {
    for (let i = 0; i < morse.length && isPlaying; i++) {
        const char = morse[i];
        switch (char) {
            case '.':
                await playDot();
                await sleep(100);
                break;
            case '-': // Dash using longer dot sound
                await playDot(15000);
                await sleep(100);
                break;
            case ' ':
                await sleep(300);
                break;
            case '/':
                await sleep(700);
                break;
        }
    }
    stopPlayback();
}

function playDot(duration = 100) {
    return new Promise((resolve) => {
        // Ensure we can play sound (some browsers require user interaction first)
        document.body.addEventListener('click', enableAudio, { once: true });

        activeSound = dotSound.cloneNode();
        activeSound.play().catch(e => {
            console.error("Audio play failed:", e);
            resolve();
        });

        activeSound.onended = resolve;

        // Stop after specified duration
        playTimeout = setTimeout(() => {
            activeSound.pause();
            activeSound.currentTime = 0;
            activeSound = null;
            resolve();
        }, duration);
    });
}

function enableAudio() {
    // This function is called on first user interaction
    // to handle browser autoplay policies
    dotSound.play().then(() => {
        dotSound.pause();
        dotSound.currentTime = 0;
    });
}

// Utility functions
function sleep(ms) {
    return new Promise(resolve => {
        playTimeout = setTimeout(resolve, ms);
    });
}

function handleClear() {
    input.value = '';
    output.value = '';
}

function handleCopy() {
    output.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = 'Copy to Clipboard';
    }, 2000);
}

// Initialize
document.addEventListener('DOMContentLoaded', init);