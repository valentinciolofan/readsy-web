import React, { useState, useEffect, useRef } from 'react';

const TextToSpeechComponent = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const speechInstance = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Automatically stop the current speech if the text prop changes and is speaking
  useEffect(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel(); // Stop current speech if text changes
      speakText(); // Start speaking the new text
    }
  }, [text]);

  // Function to start reading text
  const speakText = () => {
    if (speechInstance.current) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
    }
    const speech = new SpeechSynthesisUtterance(text); // Use the text prop here
    
    // Apply selected voice
    if (selectedVoice) {
      speech.voice = selectedVoice;
    }
    speech.lang = 'en-US'; // Adjust language if necessary
    speech.onend = () => setIsSpeaking(false); // Set the speaking state to false when finished
    window.speechSynthesis.speak(speech);
    speechInstance.current = speech;
    setIsSpeaking(true);
    setIsPaused(false);
  };

  // Function to pause reading
  const pauseText = () => {
    if (!isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // Function to stop reading
  const stopText = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleVoiceChange = (e) => {
    const selected = voices.find((voice) => voice.name === e.target.value);
    setSelectedVoice(selected);
  };

  return (
    <div>
      <h1>Text to Speech with PDF</h1>

      {/* Dropdown for voice selection */}
      <select onChange={handleVoiceChange}>
        {voices.map((voice, index) => (
          <option key={index} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>

      <button onClick={speakText} disabled={isSpeaking}>
        {isSpeaking ? 'Speaking...' : 'Speak'}
      </button>
      {isSpeaking && (
        <>
          <button onClick={pauseText}>{isPaused ? 'Resume' : 'Pause'}</button>
          <button onClick={stopText}>Stop</button>
        </>
      )}
    </div>
  );
};

export default TextToSpeechComponent;
