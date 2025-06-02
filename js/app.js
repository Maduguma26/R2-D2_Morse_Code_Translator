// Import Morse code functions from morse-code.js
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

// Audio elements
const audioElements = {
    dot: new Audio('./sounds/dot.mp3'),
    dash: new Audio('./sounds/dash.mp3'),
    finish: new Audio('./sounds/finish.mp3') // Added finish sound
};

// Initialize the application
function init() {
    // Set up cheatsheet
    cheatsheet.innerHTML = generateCheatsheet();

    // Preload audio files
    audioElements.dot.load();
    audioElements.dash.load();
    audioElements.finish.load(); // Preload finish sound

    // Set initial active button
    setActiveButton(encodeBtn);

    // Event listeners
    setupEventListeners();
}

// Set active button style
function setActiveButton(activeBtn) {
    encodeBtn.classList.remove('active');
    decodeBtn.classList.remove('active');
    activeBtn.classList.add('active');
}

// Setup all event listeners
function setupEventListeners() {
    encodeBtn.addEventListener('click', handleEncode);
    decodeBtn.addEventListener('click', handleDecode);
    playBtn.addEventListener('click', handlePlay);
    clearBtn.addEventListener('click', handleClear);
    copyBtn.addEventListener('click', handleCopy);
    // Removed the input event listener for automatic translation
}

// Translation functions
function handleEncode() {
    currentMode = 'encode';
    setActiveButton(encodeBtn);
    translate(); // Always translate when clicked
}

function handleDecode() {
    currentMode = 'decode';
    setActiveButton(decodeBtn);
    translate(); // Always translate when clicked
}

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
        console.error('Translation error:', error);
        output.value = `Error: ${error.message}`;
    }
}

// Sound playback functions
async function handlePlay() {
    if (isPlaying) return;

    const morse = currentMode === 'encode' ? output.value : input.value;
    if (!morse.trim()) return;

    isPlaying = true;
    playBtn.disabled = true;
    playBtn.textContent = 'Playing...';

    try {
        await playMorseSequence(morse);
    } catch (error) {
        console.error('Playback error:', error);
        output.value = `Audio error: ${error.message}`;
    } finally {
        isPlaying = false;
        playBtn.disabled = false;
        playBtn.textContent = 'Play Sound';
    }
}

async function playMorseSequence(morse) {
    try {
        for (const char of morse) {
            if (!isPlaying) break;

            switch (char) {
                case '.':
                    await playSound('dot');
                    await sleep(100);
                    break;
                case '-':
                    await playSound('dash');
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

        // Play finish sound when done
        if (isPlaying) {
            await playSound('finish');
        }
    } catch (error) {
        console.error('Playback error:', error);
        throw error;
    }
}

function playSound(type) {
    return new Promise((resolve) => {
        const sound = audioElements[type].cloneNode();
        sound.play().then(() => {
            sound.onended = resolve;
        }).catch(error => {
            console.error(`Failed to play ${type} sound:`, error);
            resolve();
        });
    });
}

// Utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
