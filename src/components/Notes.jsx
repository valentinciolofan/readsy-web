import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserNotes, addUserNote, editUserNote, deleteUserNotes } from '../firebase/firestore/firestoreAsyncThunk';
import Note from "./Note";
import DeleteNotesModal from "./DeleteNotesModal";
import NoteCardSkeleton from "./NoteCardSkeleton";
import NotesMenu from "./NotesMenu";
import SearchBar from "./SearchBar";

const colorClasses = ["green", "blue", "orange", "purple"];

const Notes = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const uid = user ? user.uid : null;
    const dispatch = useDispatch((state) => state.notes.userNotes);
    const navigate = useNavigate();
    const notesContainerRef = useRef();
    const { userNotes, loading, error, isDeleting } = useSelector(state => state.notes);
    const [deleteMode, setDeleteMode] = useState(false);
    const [deleteNotes, setDeleteNotes] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Search feature
    const filteredNotes = useMemo(() => {
        return userNotes.filter((note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, userNotes]);
    useEffect(() => {
        // Fetch user notes
        const fetchNotes = async () => {
            await dispatch(fetchUserNotes(uid));
            setIsFetched(true); // Mark fetch as complete
        };
        fetchNotes();

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
    }, [dispatch, uid, isDeleting]);

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
            setTimeout(setDeleteNotes([]), 500);
        }
        setDeleteMode(!deleteMode);
    }

    const handleSelectedNotes = (noteId) => {
        setDeleteNotes(prev =>
            prev.includes(noteId) ? prev.filter(id => id !== noteId) : [...prev, noteId]
        );
    };

    // Select all / deselect all notes when in delete mode
    const handleSelectAll = (inputCheckbox) => {
        if (inputCheckbox.target.checked) {
            const allNotesId = userNotes.map(note => note.id);
            setDeleteNotes(allNotesId);
        } else {
            setDeleteNotes([]);
        }
    };

    // If loading mode is set to true and notes aren't fetched show an loading animation
    if (loading && !isFetched) {
        return ''
    }

    return (
        <>
            {/* if there are notes, show them, if not, the user will see the create note state */}
            {userNotes.length ? (
                <div className="main-container">
                    <h3>My Notes</h3>
                    <div className="search-and-import">
                        {deleteMode ? (
                            <label
                                for="select-all-notes">
                                <input
                                    id="select-all-notes"
                                    type="checkbox"
                                    className="custom-checkbox"
                                    onChange={handleSelectAll}
                                />
                                <span className="checkbox-custom-checkmark"></span>
                                Select all
                            </label>
                        ) : (
                            <>
                                <SearchBar
                                    searchValue={searchTerm}
                                    onSearchChange={setSearchTerm}
                                />

                                <div>
                                    <NotesMenu onDelete={handleDeleteMode} />
                                </div>
                            </>
                        )}
                    </div>



                    {/* grid for notes */}
                    <div
                        ref={notesContainerRef}
                        className="all-notes-container">
                        {loading ? (
                            <NoteCardSkeleton />
                        ) : (
                            filteredNotes.map((note, i) => (
                                <label
                                    data-id={note.id}
                                    key={note.id}
                                    className={`note-card ${colorClasses[i % colorClasses.length]} ${deleteMode ? 'unselected' : ''}`}
                                    style={{ opacity: deleteNotes.includes(note.id) ? '1' : '' }}
                                    onClick={() => handleOpenNote(note)}
                                >
                                    <div className="note-card-overlay">
                                        <div className="note-card-header">
                                            <p className="note-card-title font-normal bold">{
                                                note.title.split(/\s+/).length === 1 ?
                                                    note.title.split(' ')[0].slice(0, 12)
                                                    :
                                                    note.title.split(/\s+/).slice(0, 3).join(' ')
                                            }</p>
                                            {deleteMode ?
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        className="custom-checkbox"
                                                        value={note.id}
                                                        checked={deleteNotes.includes(note.id)}
                                                        onChange={() => handleSelectedNotes(note.id)}
                                                    />
                                                    <span className="checkbox-custom-checkmark"></span>
                                                </>
                                                :
                                                // Add to favorite button
                                                <button
                                                    type="button"
                                                    onClick={(e) => addNoteToFav(e, i)}
                                                    className="note-card-btn favorite"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill={note.favorite ? '#000' : 'none'} stroke={note.favorite ? '#000' : 'currentColor'} strokeWidth={1} d="m4.45 13.908l6.953 6.531c.24.225.36.338.5.366a.5.5 0 0 0 .193 0c.142-.028.261-.14.5-.366l6.953-6.53a5.203 5.203 0 0 0 .549-6.983l-.31-.399c-1.968-2.536-5.918-2.111-7.301.787a.54.54 0 0 1-.974 0C10.13 4.416 6.18 3.99 4.212 6.527l-.31.4a5.203 5.203 0 0 0 .549 6.981Z"></path></svg>
                                                </button>
                                            }
                                        </div>
                                        <p className="font-small">{note.description.split(/\s+/).slice(0, 10).join(' ')}</p>
                                    </div>
                                </label>
                            ))

                        )
                        }
                    </div>
                    <DeleteNotesModal
                        deleteMode={deleteMode}
                        deleteNotes={deleteNotes}
                        handleDeleteMode={handleDeleteMode}
                        handleAddNote={handleAddNote}
                    />
                </div>
            ) : (
                <div className="dashboard-zero-files">
                    <h3>It seems that you don’t have any notes yet.</h3>
                    <button
                        type='button'
                        className="btn-primary"
                        onClick={handleAddNote}
                    >Create note</button>
                </div>
            )}

        </>
    );
};

export default Notes;