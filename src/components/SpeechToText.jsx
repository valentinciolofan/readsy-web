import React, { useState, useRef } from "react";

const SpeechToText = ({ handleSpeechInput }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const streamRef = useRef(null);  // To keep track of the microphone stream

    const handleIsRecording = () => {
        setIsRecording(prevState => {
            if (prevState) {
                stopRecording();
            } else {
                startRecording();
            }
            return !prevState;
        });
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;  // Store the stream to stop it later
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorderRef.current.addEventListener("dataavailable", event => {
                audioChunks.current.push(event.data);
            });

            mediaRecorderRef.current.addEventListener("stop", async () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
                const reader = new FileReader();

                reader.onloadend = async () => {
                    const base64Audio = reader.result.split(",")[1];

                    const response = await fetch("/.netlify/functions/speechToText", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ audioContent: base64Audio }),
                    });

                    const data = await response.json();
                    handleSpeechInput(data.transcription);
                    console.log("Transcription:", data.transcription);
                };

                reader.readAsDataURL(audioBlob);
            });

            mediaRecorderRef.current.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
            if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                alert("Microphone access was denied. Please allow microphone permissions and try again.");
            }
            setIsRecording(false);  // Reset recording state if error occurs
        }
    };

    const stopRecording = () => {
        // Stop the MediaRecorder if it's recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }

        // Stop all tracks on the stream to release the microphone
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;  // Clear the stream reference
        }
    };

    return (
        <>
            {isRecording ? (
                // Stop button (shown when recording is active)
                <svg onClick={handleIsRecording} className="readsy-input-box-icon" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M6 18V6h12v12z"></path>
                </svg>
            ) : (
                // Microphone button (shown when not recording)
                <svg onClick={handleIsRecording} className="readsy-input-box-icon" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 5 5a5 5 0 0 0 5-5z"></path>
                </svg>
            )}
        </>
    );
};

export default SpeechToText;
