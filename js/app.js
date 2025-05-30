// Use window object instead of import
const { encodeToMorse, decodeFromMorse, generateCheatsheet } = window.morseCodeFunctions;

// DOM Elements
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const input = document.getElementById('input');
const output = document.getElementById('output');
const cheatsheet = document.querySelector('.cheatsheet');

// Application state
let currentMode = 'encode';

// Initialize the application
function init() {
    cheatsheet.innerHTML = generateCheatsheet();
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
    clearBtn.addEventListener('click', handleClear);
    copyBtn.addEventListener('click', handleCopy);
}

// Translation functions
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
    output.value = text
        ? (currentMode === 'encode' ? encodeToMorse(text) : decodeFromMorse(text))
        : '';
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
