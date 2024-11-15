import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpeechToText from './SpeechToText';
import useCommandRecognition from './SpeechRecognition';
import { startTTS, stopTTS } from '../features/tts/ttsSlice';
import startSpeaking from './TextToSpeech';
import ReactMarkdown from 'react-markdown';

const ReadsyPartner = ({ onCommand }) => {
    const ttsDispatch = useDispatch((state) => state.tts.readAloud);
    const ttsStatus = useSelector((state) => state.tts.readAloud);
    const dispatch = useDispatch((state) => state.notes.userNotes);
    const pdfText = useSelector((state) => state.pdf.pdfText);
    const [registerInput, setRegisterInput] = useState(false);
    const [convHistory, setConvHistory] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [summary, setSummary] = useState('gwrfwefwfwe');
    const [isRecording, setIsRecording] = useState(null);


    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseOut = () => setIsHovered(false);
    const handleToggleNavbar = () => {
        const readsyContainer = document.querySelector('.readsy-gpt')

        if (readsyContainer.classList.value.includes('toggleReadsy')) {
            readsyContainer.classList.remove('toggleReadsy');
        } else {
            readsyContainer.classList.add('toggleReadsy');
        }
    }

    
    // Fetch answer
    const fetchAnswer = async (user_prompt) => {
        // Create a new conversation history array with the latest user message
        const updatedConvHistory = [
            ...convHistory,
            {
                role: 'user',
                content: user_prompt,
            },
        ];

        // Update state to include the latest prompt in history
        setConvHistory(updatedConvHistory);

        const url = '/.netlify/functions/readsyPartner';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: user_prompt,
                conversationHistory: updatedConvHistory,  // Use updated history here
            }),
        });

        let answer = await response.json();

        if (answer.text.includes('##NOTE_START##') && answer.text.includes('##NOTE_END##')) {
            const noteStart = answer.text.indexOf('##NOTE_START##') + '##NOTE_START##'.length;
            const noteEnd = answer.text.indexOf('##NOTE_END##');

            // Extract the content between the markers (without markers themselves)
            const noteContent = answer.text.slice(noteStart, noteEnd).trim();

            // Set the extracted note content
            setSummary({
                'title': 'note',
                'content': noteContent  // This only has the note content, no markers
            });

            // Update answer.text to remove the markers, keeping the note content readable
            answer.text = answer.text.replace('##NOTE_START##', 'Note: "').replace('##NOTE_END##', '"');
        }

        await showAnswer(answer.text);

        return answer.text;
    };

    // Show Readsy answer
    const showAnswer = async (message) => {
        setConvHistory(prevHistory => [
            ...prevHistory,
            {
                role: 'bot',
                content: message
            }
        ]);
    };

    // Create the html elements for updating the conversation with the latest user message
    const createHtmlMessage = (message) => {
        // first check if there is any marker inside message
        if (message.includes('##END_SESSION##')) {
            message = message.replace('##END_SESSION##', '');
        }
        setConvHistory(prevHistory => [
            ...prevHistory,
            {
                role: 'user',
                content: message
            }
        ]);
    };
    // Send the prompt to readsy
    const handleSendPrompt = async (e) => {
        if (e.keyCode === 13) {
            const prompt = e.target.value;
            createHtmlMessage(prompt);

            // Clear input box
            e.target.value = '';

            // Fetch and show the bot's response
            const response = await fetchAnswer(prompt);
        }
    };

    const handleSpeechInput = (speech_input) => {
        const input = document.querySelector('.readsy-input-box');

        input.value = speech_input;
    }

    // const handleCommand = (command) => {
    //     if (command === "stop") {
    //         if (ttsStatus) {
    //             ttsDispatch(stopTTS());
    //         }

    //     }
    //     if (command === "open") {
    //         handleToggleNavbar();
    //     }
    //     if (command === "close") {
    //         handleToggleNavbar();
    //     } else if (command === "summarise") {
    //         if (pdfText) {
    //             const summary = fetchAnswer('Summarize the following book: ' + pdfText);
    //             setSummary(summary);
    //         }
    //     } else if (command === "note") {
    //         const newNote = {
    //             id: Date.now(),
    //             title: "New Note",
    //             description: summary,
    //         };
    //         dispatch(addNote(newNote));
    //     }

    // };




    // Send the prompt after the speech is registered
    const handleSendRegisteredPrompt = async (status, prompt) => {
        if (status && prompt !== "") {
            createHtmlMessage(prompt);
            let answer = await fetchAnswer(prompt);
            const result = await startSpeaking(answer);
            setIsRecording(true);
        }
    }


    return (

        <>
            {/* <button onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button> 
              // const { startListening, stopListening } = useCommandRecognition(handleCommand);

    // const toggleListening = () => {
    //     if (isListening) {
    //         stopListening();
    //     } else {
    //         startListening();
    //     }
    //     setIsListening(!isListening);
    // };

            
            */}
            <aside className="readsy-gpt"
                onMouseOver={handleMouseEnter}
                onMouseLeave={handleMouseOut}>
                <button onClick={handleToggleNavbar} type="button" className="toggleBtn readsy"
                    style={{ visibility: isHovered ? 'visible' : 'hidden' }}><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M24 36L12 24l12-12m12 24L24 24l12-12"></path></svg></button>

                <div className='readsy-avatar-and-name'>
                    <img src='/src/assets/images/readsy.svg' alt="readsy" />
                    <p className='font-normal'>Readsy</p>
                </div>
                <div className='readsy-conversation-container'>
                    <div className="readsy-conversation">
                        {convHistory.map((message, index) => (
                            <ReactMarkdown key={index}
                                className={message.role === 'user' ? 'user-message-to-readsy' : 'readsy-message'} >{message.content}</ReactMarkdown>
                        ))}
                    </div>
                </div>

                <div className="readsy-input-box-container">
                    <input
                        onKeyDown={handleSendPrompt}
                        type="search"
                        placeholder="Ask me something"
                        className="readsy-input-box" />
                    <SpeechToText
                        onRegisterEnd={handleSendRegisteredPrompt}
                        handleSpeechInput={handleSpeechInput}
                        isRecording={isRecording}
                        setIsRecording={setIsRecording}
                    />
                </div>

            </aside>
        </>

    );
}

export default ReadsyPartner;