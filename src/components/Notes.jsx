import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserNotes, addUserNote, editUserNote, deleteUserNotes } from '../firebase/firestore/notes/firestoreAsyncThunk';
import Note from "./Note";
import DeleteNotesModal from "./DeleteNotesModal";

const colorClasses = ["green", "blue", "orange", "purple"];

const Notes = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const uid = user ? user.uid : null;
    const dispatch = useDispatch((state) => state.notes.userNotes);
    const navigate = useNavigate();
    const notesContainerRef = useRef();
    const { userNotes, loading, error } = useSelector(state => state.notes);
    const [deleteMode, setDeleteMode] = useState(false);
    const [deleteNotes, setDeleteNotes] = useState([]);

    useEffect(() => {
        // Fetch user notes
        dispatch(fetchUserNotes(uid));

        // Check if the user is on a mobile device
        if (!isMobileDevice()) return;

        // Cache the notes container
        notesContainerRef.current = document.querySelector('.all-notes-container');
        if (!notesContainerRef.current) return;

        // Add touchstart listener for mobile devices
        notesContainerRef.current.addEventListener('touchstart', holdToStartDeleteMode, { passive: true });

        // Cleanup the listener on unmount
        return () => {
            if (notesContainerRef.current) {
                notesContainerRef.current.removeEventListener('touchstart', holdToStartDeleteMode);
            }
        };
    }, [dispatch, uid]);

    // Utility function to detect if the user is on a mobile device
    const isMobileDevice = () => {
        return window.matchMedia("(max-width: 768px)").matches;
    };

    // Handle hold-to-delete logic
    const holdToStartDeleteMode = (event) => {
        const noteCard = event.target.closest('.note-card');
        if (!noteCard) return;

        let holdTimer = setTimeout(() => {
            if (isMobileDevice()) {
                setDeleteMode(true);
            }
        }, 500); // 500ms hold duration

        const cancelHold = () => {
            clearTimeout(holdTimer);
            window.removeEventListener('touchend', cancelHold);
            window.removeEventListener('touchmove', cancelHold);
        };

        window.addEventListener('touchend', cancelHold);
        window.addEventListener('touchmove', cancelHold);
    };


    const handleAddNote = async () => {
        navigate(`/dashboard/notes/note/${'create'}`, { state: { uid, userNotes } })
    };
    const handleEditNote = (noteId) => {
        const updatedNote = { title: 'Updated Title', content: 'Updated content' };
        dispatch(editUserNote({ noteId, updatedNote }));
    };

    const handleOpenNote = (note) => {
        if (!deleteMode) {
            navigate(`/dashboard/notes/note/${note.title}`, { state: { uid, note, userNotes } })
        }
    };
    // Add to note to favorite
    const addNoteToFav = (e, noteIndex) => {
        e.stopPropagation();
        // Get the note at the given index
        const note = { ...userNotes[noteIndex] }; // Clone the note to avoid direct mutation
        const noteId = note.id;
        // Toggle the favorite property
        note.favorite = !note.favorite;

        console.log(noteId, note);
        dispatch(editUserNote({ noteId, note }));

        console.log('Added to favorite');
    }
    // Turn on/off delete notes mode
    const handleDeleteMode = () => {
        // When user turns off the delete mode, clear the deleteNotes state
        if (deleteMode) {
            setDeleteNotes([]);
        }
        setDeleteMode(!deleteMode);
    }

    const handleSelectedNotes = (noteId) => {
        setDeleteNotes(prev =>
            prev.includes(noteId) ? prev.filter(id => id !== noteId) : [...prev, noteId]
        );
    };

    // Select all / deselect all notes when in delete mode
    const handleSelectAll = () => {
        console.log(deleteNotes.length)
        if (deleteNotes.length === 0) {
            const allNotesId = userNotes.map(note => note.id);
            setDeleteNotes(allNotesId);
        } else if (deleteNotes.length > 0) {
            const allNotesId = userNotes.map(note => note.id);
            setDeleteNotes([]);
        }

    };



    // useEffect(() => {
    //     window.addEventListener('click', (e) => {
    //         console.log(e.target, 'event');
    //     })
    // }, [])

    return (
        <>
            {/* if there are notes, show them, if not, the user will see the create note state */}
            {userNotes ? (
                <div className="main-container">
                    <h3>My Notes</h3>
                    <div className="search-and-import">
                        {deleteMode ? (
                            <button
                                type="button"
                                onClick={handleSelectAll}
                            >
                                Select All
                            </button>
                        ) : (
                            <>
                                <div className="search-box-container">
                                    <svg className="search-box-icon" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#909090" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"></path></svg>
                                    <input
                                        type="search"
                                        placeholder="Search by name of the document"
                                        className="search-box" />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="createNote btn-primary rounded"
                                        style={{ display: userNotes ? "block" : "none" }}
                                        onClick={handleAddNote}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"></path></svg>
                                    </button>

                                </div>
                            </>
                        )}
                    </div>



                    {/* grid for notes */}
                    <div
                        ref={notesContainerRef}
                        className="all-notes-container">
                        {userNotes.map((note, i) => (
                            <label
                                key={note.id}
                                className={`note-card ${colorClasses[i % colorClasses.length]} ${deleteMode ? 'unselected' : ''}`}
                                style={{ opacity: deleteNotes.includes(note.id) ? '1' : '' }}
                                onClick={() => handleOpenNote(note)}
                            >
                                <div className="note-card-overlay">
                                    <div className="note-card-header">
                                        <p className="note-card-title font-normal bold">{note.title.split(/\s+/).slice(0, 3).join(' ')}</p>
                                        {deleteMode ?
                                            <>
                                                <input
                                                    type="checkbox"
                                                    className="note-card-checkbox"
                                                    value={note.id}
                                                    checked={deleteNotes.includes(note.id)}
                                                    onChange={() => handleSelectedNotes(note.id)}
                                                />
                                                <span className="note-card-checkmark"></span>
                                            </>
                                            :
                                            // Add to favorite button
                                            <button
                                                type="button"
                                                onClick={(e) => addNoteToFav(e, i)}
                                                className="note-card-btn favorite"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill={note.favorite ? '#000' : 'none'} stroke={note.favorite ? '#000' : 'currentColor'} strokeWidth={1} d="m4.45 13.908l6.953 6.531c.24.225.36.338.5.366a.5.5 0 0 0 .193 0c.142-.028.261-.14.5-.366l6.953-6.53a5.203 5.203 0 0 0 .549-6.983l-.31-.399c-1.968-2.536-5.918-2.111-7.301.787a.54.54 0 0 1-.974 0C10.13 4.416 6.18 3.99 4.212 6.527l-.31.4a5.203 5.203 0 0 0 .549 6.981Z"></path></svg>
                                            </button>
                                        }
                                    </div>
                                    <p className="font-small">{note.description.split(/\s+/).slice(0, 10).join(' ')}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <DeleteNotesModal
                        deleteMode={deleteMode}
                        deleteNotes={deleteNotes}
                        handleDeleteMode={handleDeleteMode}
                    />
                </div>
            ) : (
                <div className="dashboard-zero-files">
                    <h3>It seems that you don’t have any notes yet.</h3>
                    <button
                        type='button'
                        className="btn-primary"
                    // onClick={handleCreateNote}
                    >Create note</button>
                </div>
            )}
        </>
    );
};

export default Notes;