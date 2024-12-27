import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { convertFromRaw } from 'draft-js';
import { fetchUserNotes, addUserNote, editUserNote, deleteUserNotes } from '../firebase/firestore/firestoreAsyncThunk';
import NoteHeader from "./NoteHeader";
import NoteEditor from "./NoteEditor";
import { useDispatch } from "react-redux";

const Note = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(state => state.notes.userNotes);
    const location = useLocation();
    const userId = location?.state?.uid;
    const noteTitleRef = useRef(null);
    const [userNotes, setUserNotes] = useState(location.state?.userNotes || '');
    const [noteTitle, setNoteTitle] = useState(location.state?.note?.title || '');
    const [noteContent, setNoteContent] = useState(location.state?.note?.content || null);
    const [alertMessage, setAlertMessage] = useState(null);

    const loadNoteContent = (note_content) => {
        setNoteContent(note_content)
    }
    const closeNote = async () => {
        // Get note id if the note already exists
        const noteId = location.state?.note?.id;

        // Convert the noteContent to editor content and get the plain text
        let noteDescription = '';
        
        if (noteContent !== null) {
            noteDescription = convertFromRaw(noteContent).getPlainText() || '';
        }
        console.log(noteDescription);
        // Create note object 
        const note = {
            title: noteTitle || 'New Note',
            content: noteContent || '',
            description: noteDescription.split(' ').slice(0, 13).join(' '),
            favorite: false
        }

        // If there is a note id, edit the actual note, else create a new note.
        if (noteId) {
            dispatch(editUserNote({ noteId, note }));
        } else if (noteContent !== null || noteTitle !== '') {
            dispatch(addUserNote({ userId, note }));
        }

        // Redirect the user to notes 
        navigate('/dashboard/notes');
    }

    return (
        <div className="note-container">
            <div className="note-wrapper">
                <NoteHeader
                    noteTitleRef={noteTitleRef}
                    noteTitle={noteTitle}
                    setNoteTitle={setNoteTitle}
                    noteContent={noteContent}
                    closeNote={closeNote}
                />
                <NoteEditor noteContent={noteContent} loadNoteContent={loadNoteContent} setNoteContent={setNoteContent} />
            </div>
        </div>
    );
};

export default Note;