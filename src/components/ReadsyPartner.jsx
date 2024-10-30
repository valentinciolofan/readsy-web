import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpeechToText from './SpeechToText';
import useCommandRecognition from './SpeechRecognition';
import { setNotes, addNote, editNote, deleteNote } from "../features/notes/notesSlice";


const ReadsyPartner = ({ onCommand }) => {
    const dispatch = useDispatch((state) => state.notes.userNotes);
    const pdfText = useSelector((state) => state.pdfReducer.pdfText);
    const [convHistory, setConvHistory] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [summary, setSummary] = useState('gwrfwefwfwe');

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

    useEffect(() => async () => {
        await fetchAnswer('Hello');
    }, [])

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

        // Update state to include the latest prompt in the history
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

        const answer = await response.json();

        await showAnswer(answer.text);

        return answer;
    };


    // Show Readsy answer
    const showAnswer = async (message) => {
        // Get the parent container where the messages are displayed
        const convParentElement = document.querySelector('.readsy-conversation');

        // Create a div element and assign the proper class for styling
        const createElement = document.createElement('div');
        createElement.setAttribute('class', 'readsy-message');

        // Create a p element that will display the user message
        const createMessage = document.createElement('p');
        createMessage.setAttribute('class', 'font-medium');
        const msg = document.createTextNode(message);

        // Append the elements and text node in order to show the latest prompt that the user sent to Readsy.
        createMessage.appendChild(msg);
        createElement.appendChild(createMessage);
        convParentElement.appendChild(createElement);

        // Update conversation history.
        setConvHistory([
            ...convHistory,
            {
                'role': 'bot',
                'content': message
            }]);
    }

    // Send the prompt to readsy
    const handleSendPrompt = (e) => {
        // Check if the pressed key is 'enter'
        if (e.keyCode == 13) {
            // Send the prompt to gpt 
            fetchAnswer(e.target.value);

            // Create the html elements for updating the conversation with the latest user message

            // Get the parent container where the messages are displayed
            const convParentElement = document.querySelector('.readsy-conversation');

            // Create a div element and assign the proper class for styling
            const createElement = document.createElement('div');
            createElement.setAttribute('class', 'user-message-to-readsy');

            // Create a p element that will display the user message
            const createMessage = document.createElement('p');
            createMessage.setAttribute('class', 'font-medium');
            const msg = document.createTextNode(e.target.value);

            // Append the elements and text node in order to show the latest prompt that the user sent to Readsy.
            createMessage.appendChild(msg);
            createElement.appendChild(createMessage);
            convParentElement.appendChild(createElement);

            // Clear the message input box
            e.target.value = '';
        }
    }

    const handleSpeechInput = (speech_input) => {
        const input = document.querySelector('.readsy-input-box');

        input.value = speech_input;
    }

    const handleCommand = (command) => {
        if (command === "stop") {
            setIsListening(false); // Update state if needed
        }
        if (command === "open") {
            handleToggleNavbar();
        }
        if (command === "close") {
            handleToggleNavbar();
        } else if (command === "summarise") {
            if (pdfText) {
                const summary = fetchAnswer('Summarize the following book: ' + pdfText);
                setSummary(summary);
            }
        } else if (command === "note") {
            const newNote = {
                id: Date.now(),
                title: "New Note",
                description: summary,
            };
            dispatch(addNote(newNote));
        }

    };

    const { startListening, stopListening } = useCommandRecognition(handleCommand);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
        setIsListening(!isListening);
    };

    return (

        <>
            <button onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
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
                    <div className="readsy-conversation"></div>
                </div>

                <div className="readsy-input-box-container">
                    <input
                        onKeyDown={handleSendPrompt}
                        type="search"
                        placeholder="Ask me something"
                        className="readsy-input-box" />
                    <SpeechToText handleSpeechInput={handleSpeechInput} />
                </div>

            </aside>
        </>

    );
}

export default ReadsyPartner;