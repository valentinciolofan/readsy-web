import React, { useRef, useEffect } from 'react';


const NoteHeader = ({ noteTitleRef, noteTitle, setNoteTitle, noteContent, closeNote }) => {
    const titleCharactersLimit = useRef(null);

    const handleNoteTitle = (e) => {
        // Check if the title is > 50 characters
        const titleLength = e.length;

        // Update the character counter
        titleCharactersLimit.current.textContent = titleLength ? `${titleLength}/30` : `0/30`;

        if (titleLength <= 30) {
            setNoteTitle(e);

        } else {
            // Stop updating the title... and make character limit scale or another color red smth...
        }
    }

    const handleKeyPress = (e) => {
        // Check if the user is trying to type (exclude navigation keys and shortcuts)
        const nonTypingKeys = [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End",
            "Tab"
        ];
    
        const isModifierPressed = e.ctrlKey || e.metaKey || e.altKey; // Exclude modifier actions
        const isTypingKey = !nonTypingKeys.includes(e.key) && !isModifierPressed;
    
        if (noteTitle.length >= 30 && isTypingKey && e.key !== "Backspace") {
            e.preventDefault(); // Block additional typing
            triggerShakeEffect(); // Trigger visual effect
        }
    };
    

    const triggerShakeEffect = () => {
        const charLimitSpan = titleCharactersLimit.current;
        if (charLimitSpan) {
            charLimitSpan.classList.add("max-length-attempt");
            setTimeout(() => {
                charLimitSpan.classList.remove("max-length-attempt");
            }, 300); // Remove effect after animation
        }
    };


    const goBack = () => {
        closeNote();
    };

    useEffect(() => {
        // If there is no title, make sure the title gets focused
        if (!noteTitleRef.current.value) {
            noteTitleRef.current.focus();
        }

    }, [noteTitle])



    return (
        <div className="note-header">
            {/* Button to go back to all notes */}
            <button type="button" className="btnBack" onClick={goBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"></path>
                </svg>
            </button>
            {/* The note title goes here */}
            <label>
                <input
                    ref={noteTitleRef}
                    contentEditable="true"
                    className="note-title"
                    value={noteTitle}
                    placeholder={!noteTitle ? "Type the title here..." : ""}
                    onChange={(e) => handleNoteTitle((e.target.value))}
                    onKeyDown={handleKeyPress}
                    maxLength={30}
                />
                <span
                    ref={titleCharactersLimit}
                    className="title-char-limit-counter"
                    >
                    {noteTitle.length}/30
                </span>
            </label>
        </div>
    );
}

export default NoteHeader;