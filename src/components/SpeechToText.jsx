import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const SpeechToText = ({ onRegisterEnd, handleSpeechInput, isRecording, setIsRecording }) => {
    const ttsStatus = useSelector(state => state.tts.readAloud);
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const streamRef = useRef(null);
    const silenceTimeoutRef = useRef(null);

    useEffect(() => {
        // When isRecording is set to true, start recording
        if (isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorderRef.current.addEventListener("dataavailable", event => {
                audioChunks.current.push(event.data);
                clearSilenceTimer(); // Reset silence timer on audio data
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
                    setTimeout(() => onRegisterEnd(true, data.transcription), 1000);
                    console.log("Transcription:", data.transcription);
                };

                reader.readAsDataURL(audioBlob);
            });

            mediaRecorderRef.current.start();

            // Start silence detection timeout
            silenceTimeoutRef.current = setTimeout(() => {
                console.log("Stopping due to silence.");
                resetSilence();
            }, 5000); // 5 seconds of silence

        } catch (error) {
            console.error("Error accessing microphone:", error);
            if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                alert("Microphone access was denied. Please allow microphone permissions and try again.");
            }
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        clearSilenceTimer();

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const resetSilence = () => {
        stopRecording();
        setIsRecording(false);
        onRegisterEnd(true, ""); // Trigger callback with empty string on silence
    };

    const clearSilenceTimer = () => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }
    };

    return (
        <>
            {isRecording ? (
                <svg onClick={() => setIsRecording(null)} className="readsy-input-box-icon" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M6 18V6h12v12z"></path>
                </svg>
            ) : (
                <svg onClick={() => setIsRecording(true)} className="readsy-input-box-icon" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3m7 9c0 3.53-2.61 6.44-6 6.93V21h-2v-3.07c-3.39-.49-6-3.4-6-6.93h2a5 5 0 0 0 5 5a5 5 0 0 0 5-5z"></path>
                </svg>
            )}
        </>
    );
};

export default SpeechToText;
