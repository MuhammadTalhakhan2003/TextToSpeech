const synth = window.speechSynthesis;

//Dom Elements
const textForm = document.querySelector('form');
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');
const rate = document.getElementById('rate');
const rateValue = document.getElementById('rate-value');
const pitch = document.getElementById('pitch');
const pitchValue = document.getElementById('pitch-value');
const body = document.querySelector('body');
const speakButton = document.querySelector('button');

//Init voices array 
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    
    //Loop through voices and create an option for each one 
    voices.forEach(voice => {
        const option = document.createElement("option");
        //fill option with voice and language
        option.textContent = `${voice.name} (${voice.lang})`;

        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);

        voiceSelect.appendChild(option);
    });
};
getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

//Speak function
const speak = () => {
    if (synth.speaking) {
        console.error('Already speaking...');
        return;
    }

    if (textInput.value !== '') {
        // Change button to "Speaking..." and disable it
        speakButton.textContent = 'Speaking...';
        speakButton.disabled = true;

        // Change background to wave
        body.style.background = '#141414 url(img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';

        const speakText = new SpeechSynthesisUtterance(textInput.value);

        // When speaking ends
        speakText.onend = e => {
            console.log('Done Speaking...');
            body.style.background = '#141414';  // Revert background
            speakButton.textContent = 'Speak it';  // Revert button text
            speakButton.disabled = false;  // Enable button again
        };

        // Speak Error
        speakText.onerror = e => {
            console.error('Something went wrong');
            speakButton.textContent = 'Speak it';  // Revert button text in case of error
            speakButton.disabled = false;  // Enable button again
        };

        // Selected Voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        // Loop through voices
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        // Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Speak the text
        synth.speak(speakText);
    }
};

//Event Listeners

// Text Form Submit
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

// Rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener('change', e => speak());
