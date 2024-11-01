import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import NoteToolbar from "./NoteToolbar";

const note = `# My Markdown Document

## Introduction

Markdown is a lightweight *markup language* with plain text formatting syntax. Its simplicity and ease of use have made it very popular.

### Main Features

- **Easy Formatting**: Simple syntax for **bold** and *italic* text.
- **Lists**: Create lists effortlessly.
- **Headings and Subheadings**: Organize content with # symbols.

> "Markdown is a writer's best friend." – *Author Unknown*

### Quick Code Example`;


const NoteEditor = () => {
    const [content, setContent] = useState(note);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
    const [showToolbar, setShowToolbar] = useState(false);
    const [activeButton, setActiveButton] = useState(null); // Track active toolbar button
    const editorRef = useRef(null);
    const toolbarBtnRef = useRef('text');

    useEffect(() => {
        editorRef.current.focus();
    }, [])

    // If the editor content change, then save the real time state.
    const handleEditorChange = (e) => {
        // Get real time content
        const rawContent = e.target.innerHTML;

        // Purify the content to prevent XSS
        const sanitizedContent = DOMPurify.sanitize(rawContent);

        // Update the content.
        setContent(sanitizedContent)
    }



    // Get the selected text and activate the toolbar.
    const handleSelection = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            const format_text = toolbarBtnRef.current;
            const wrapper = document.createElement(format_text);
            range.surroundContents(wrapper);

            setToolbarPosition({
                top: rect.top + 40,
                left: rect.left - 60
            });
            setShowToolbar(true);

        } else {
            setShowToolbar(false);
        }

    }

    useEffect(() => {
        // Add an event listener to detect text selection
        document.addEventListener('selectionchange', handleSelection);

        // Remove the event listener
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);
    return (
        <>
            {showToolbar &&
                <NoteToolbar
                    toolbarBtnRef={toolbarBtnRef}
                    toolbarPosition={toolbarPosition}
                    activeButton={activeButton}
                    setActiveButton={setActiveButton}
                />
            }
            <div
                ref={editorRef}
                contentEditable="true"
                className="note-editor"
                onChange={handleEditorChange}
            >
                <ReactMarkdown>{content}</ReactMarkdown>


            </div>
        </>

    );
};


export default NoteEditor;

