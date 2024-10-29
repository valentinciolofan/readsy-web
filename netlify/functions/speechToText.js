import { SpeechClient } from "@google-cloud/speech";
import { buffer } from "node:stream/consumers";

export const handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    // Initialize the Google Cloud Speech Client
    const client = new SpeechClient();

    // Parse the audio file from the request
    const { audioContent, languageCode = 'en-US' } = JSON.parse(event.body);

    // Prepare the request payload for Google Cloud Speech-to-Text
    const request = {
    audio: {
        content: audioContent,  // base64-encoded audio data
    },
    config: {
        encoding: "WEBM_OPUS",  // If using WEBM Opus encoding
        sampleRateHertz: 48000,  // Match the actual audio sample rate
        languageCode,
    },
};


    try {
        // Perform the transcription
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join("\n");

        return {
            statusCode: 200,
            body: JSON.stringify({ transcription }),
        };
    } catch (error) {
        console.error("Error with Speech-to-Text API:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error processing audio" }),
        };
    }
};
