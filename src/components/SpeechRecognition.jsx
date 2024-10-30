import { useEffect, useRef } from "react";

const useCommandRecognition = (onCommandDetected) => {
    const recognitionRef = useRef(null);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech Recognition is not supported in this browser.");
            return;
        }

        // Initialize SpeechRecognition
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.continuous = false; // Only listen once and stop
        recognition.interimResults = false; // Only get final results
        recognition.lang = "en-US";

        // Handle speech results
        recognition.onresult = (event) => {
            const lastResultIndex = event.results.length - 1;
            const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
            console.log("Heard command:", transcript);

            // Check for the specific command
            if (transcript === "stop") {
                onCommandDetected("stop"); // Trigger the stop function
                recognition.stop(); // Stop recognition to avoid looping
            } else if (transcript.includes("hello read")) {
                onCommandDetected("open"); // Trigger the stop function
                recognition.stop(); // Stop recognition to avoid looping
            } else if (transcript.includes("bye read")) {
                onCommandDetected("close"); // Trigger the stop function
                recognition.stop(); // Stop recognition to avoid looping
            } else if (transcript.includes("summarise")) {
                onCommandDetected("summarise");
                recognition.stop();
            } else if (transcript.includes("note")) {
                onCommandDetected("note");
                recognition.stop();
            }
        };

        // Error handling
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            recognition.stop();
        };

        // Start recognition
        recognition.start();
        console.log("Speech recognition started, waiting for 'stop' command...");
    };

    // Stop recognition explicitly if needed
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            console.log("Speech recognition stopped.");
        }
    };

    return { startListening, stopListening };
};

export default useCommandRecognition;
