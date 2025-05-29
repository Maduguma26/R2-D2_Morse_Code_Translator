// Morse code dictionary
const morseCode = {
    // Letters
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..',

    // Numbers
    '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.',

    // Punctuation
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
    '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
    '$': '...-..-', '@': '.--.-.', ' ': '/'
};

// Reverse dictionary for decoding
const reverseMorse = {};
for (const key in morseCode) {
    reverseMorse[morseCode[key]] = key;
}

/**
 * Encodes text to Morse code
 * @param {string} text - Input text to encode
 * @returns {string} Morse code
 */
function encodeToMorse(text) {
    return text.toUpperCase().split('').map(char => {
        return morseCode[char] || char;
    }).join(' ');
}

/**
 * Decodes Morse code to text
 * @param {string} morse - Morse code to decode
 * @returns {string} Decoded text
 */
function decodeFromMorse(morse) {
    return morse.split(' ').map(code => {
        return reverseMorse[code] || code;
    }).join('');
}

/**
 * Generates a cheatsheet of Morse codes
 * @returns {string} HTML for cheatsheet
 */
function generateCheatsheet() {
    const letters = Object.entries(morseCode).filter(([key]) => key.length === 1 && key !== ' ');
    let html = '';

    letters.forEach(([char, code]) => {
        html += `<div><strong>${char}</strong>: ${code}</div>`;
    });

    return html;
}

export { encodeToMorse, decodeFromMorse, generateCheatsheet };