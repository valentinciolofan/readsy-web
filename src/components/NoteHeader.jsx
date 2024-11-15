import React, { useRef, useEffect } from 'react';


const NoteHeader = ({ noteTitleRef, noteTitle,  setNoteTitle, noteContent, closeNote }) => {

    const handleNoteTitle = (e) => {
        const title = e;
        setNoteTitle(e);
    }

    const goBack = () => {
        closeNote();

        if (!noteContent) {

        } else {
        }
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
            {/* The note title goes here  */}
            <input
                ref={noteTitleRef}
                contentEditable="true"
                className="note-title"
                value={noteTitle}
                placeholder={!noteTitle ? "Type the title here..." : ""}
                onChange={(e) => handleNoteTitle((e.target.value))}
            />
        </div>
    );
}

export default NoteHeader;