import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import 'react-quill/dist/quill.bubble.css';
import debounce from 'lodash.debounce';

const Note = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const canvasRef = useRef();

    const [noteTitle, setNoteTitle] = useState("The Intelligent Investor");
    const [noteContent, setNoteContent] = useState(""); // Rich text content
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [isEraserMode, setIsEraserMode] = useState(false);

    // Autosave functionality with debounce
    useEffect(() => {
        const debouncedSave = debounce(() => {
            saveNote();
        }, 2000); // 2-second delay for autosaving
        debouncedSave();

        return () => {
            debouncedSave.cancel();
        };
    }, [noteContent, noteTitle]);

    const goBack = () => {
        navigate(-1);
    };

    const saveNote = () => {
        console.log('Autosaving note:', { noteTitle, noteContent });
    };

    const toggleDrawingMode = () => {
        setIsDrawingMode(!isDrawingMode);
    };

    const clearCanvas = () => {
        canvasRef.current.clearCanvas();
    };

    const toggleEraser = () => {
        if (!isEraserMode) {
            canvasRef.current.eraseMode(true); // Enable eraser mode
        } else {
            canvasRef.current.eraseMode(false); // Disable eraser mode
        }
        setIsEraserMode(!isEraserMode); // Toggle the eraser mode state
    };

    return (
        <div className="note-container">
            <div className="note-header">
                <button type="button" className="btnBack" onClick={goBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                        <path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"></path>
                    </svg>
                </button>
                <input
                    type="text"
                    className="note-title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                />
            </div>

            <div className="note-editor-container">
                <ReactQuill
                    theme="bubble"
                    value={noteContent}
                    onChange={setNoteContent}
                    placeholder="Start typing your note..."
                    className="rich-text-editor"
                />

                {/* Drawing Canvas */}
                <div className="canvas-overlay" style={{ pointerEvents: isDrawingMode ? 'auto' : 'none' }}>
                    <ReactSketchCanvas
                        ref={canvasRef}
                        strokeWidth={isEraserMode ? 20 : 4} // Eraser uses wider strokes
                        strokeColor={isEraserMode ? "white" : "black"} // Change color for eraser
                        canvasColor="transparent"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: isDrawingMode ? 10 : 1,
                        }}
                    />
                </div>

                {/* buttons for drawing, text enabeling (not yet available) */}


            </div>

            <div className="note-editor-toolbar-custom">
                <button onClick={saveNote} className="saveNoteBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 19v-6h10v6h2V7.828L16.172 5H5v14zM4 3h13l4 4v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m5 12v4h6v-4z"></path>
                    </svg>
                </button>
                <button onClick={toggleDrawingMode} className={`drawingBtn ${isDrawingMode ? 'active' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9.75 20.85c1.78-.7 1.39-2.63.49-3.85c-.89-1.25-2.12-2.11-3.36-2.94A9.8 9.8 0 0 1 4.54 12c-.28-.33-.85-.94-.27-1.06c.59-.12 1.61.46 2.13.68c.91.38 1.81.82 2.65 1.34l1.01-1.7C8.5 10.23 6.5 9.32 4.64 9.05c-1.06-.16-2.18.06-2.54 1.21c-.32.99.19 1.99.77 2.77c1.37 1.83 3.5 2.71 5.09 4.29c.34.33.75.72.95 1.18c.21.44.16.47-.31.47c-1.24 0-2.79-.97-3.8-1.61l-1.01 1.7c1.53.94 4.09 2.41 5.96 1.79m11.09-15.6c.22-.22.22-.58 0-.79l-1.3-1.3a.56.56 0 0 0-.78 0l-1.02 1.02l2.08 2.08M11 10.92V13h2.08l6.15-6.15l-2.08-2.08z"></path>
                    </svg>
                </button>
                <button onClick={toggleEraser} className={`eraserBtn ${isEraserMode ? 'active' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="-1.5 -2.5 24 24">
                        <path fill="currentColor" d="M12.728 12.728L8.485 8.485l-5.657 5.657l2.122 2.121a3 3 0 0 0 4.242 0zM11.284 17H14a1 1 0 0 1 0 2H3a1 1 0 0 1-.133-1.991l-1.453-1.453a2 2 0 0 1 0-2.828L12.728 1.414a2 2 0 0 1 2.828 0L19.8 5.657a2 2 0 0 1 0 2.828z"></path>
                    </svg>
                </button>
                <button onClick={clearCanvas} className="clear-drawings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M3 6v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6H3Zm2 0h14v13H5V6Zm8 5v5h-2v-5H8l4-4l4 4h-3Z"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Note;
