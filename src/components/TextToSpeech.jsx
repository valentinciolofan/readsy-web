const startSpeaking = (text) => {
    return new Promise((resolve, reject) => {
      if (!text) {
        console.error("No text provided to speak.");
        reject("No text provided to speak.");
        return;
      }
  
      const utterance = new SpeechSynthesisUtterance(text);
  
      // Event listeners for logging and debugging
      utterance.onstart = () => {
        console.log("Speech started.");
      };
  
      utterance.onend = () => {
        console.log("Speech ended.");
        resolve("finished");
      };
  
      utterance.onerror = (event) => {
        console.error("Speech synthesis encountered an error:", event.error);
        reject(event.error);
      };
  
      utterance.onpause = () => {
        console.log("Speech paused.");
      };
  
      utterance.onresume = () => {
        console.log("Speech resumed.");
      };
  
      utterance.onmark = (event) => {
        console.log(`Speech reached mark: ${event.name}`);
      };
  
      utterance.onboundary = (event) => {
        console.log(`Speech reached boundary at character ${event.charIndex}`);
      };
  
      // Start speaking
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Error occurred while starting speech synthesis:", error);
        reject(error);
      }
    });
  };
  
  export default startSpeaking;
  