import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import NoteEditor from "./NoteEditor";

const Note = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [noteTitle, setNoteTitle] = useState("The Intelligent Investor");
    const [noteContent, setNoteContent] = useState(""); // Rich text content
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [isEraserMode, setIsEraserMode] = useState(false);

    const goBack = () => {
        navigate(-1);
    };



    return (
        <div className="note-container">
            <div className="note-wrapper">
                <div className="note-header">
                    <button type="button" className="btnBack" onClick={goBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                            <path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"></path>
                        </svg>
                    </button>
                    <h1
                        contentEditable="true"
                        className="note-title"
                    >
                        {noteTitle}
                    </h1>

                </div>
                <NoteEditor />
            </div>
        </div>

    );
};

export default Note;