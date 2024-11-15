import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserNotes, addUserNote, editUserNote, deleteUserNotes } from '../firebase/firestore/notes/firestoreAsyncThunk';
import Note from "./Note";

const colorClasses = ["green", "blue", "orange", "purple"];

const Notes = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const uid = user ? user.uid : null;
    const dispatch = useDispatch((state) => state.notes.userNotes);
    const navigate = useNavigate();
    const { userNotes, loading, error } = useSelector(state => state.notes);

    useEffect(() => {
        dispatch(fetchUserNotes(uid));
        console.log(userNotes);
    }, []);


    const handleAddNote = async () => {
        navigate(`/dashboard/notes/note/${'create'}`, { state: { uid, userNotes }})
    };
    const handleEditNote = (noteId) => {
        const updatedNote = { title: 'Updated Title', content: 'Updated content' };
        dispatch(editUserNote({ noteId, updatedNote }));
    };
    const handleDeleteNotes = (noteIds) => {
        dispatch(deleteUserNotes({ uid, noteIds }));
    };
    const handleOpenNote = (note) => {
        navigate(`/dashboard/notes/note/${note.title}`, { state: { uid, note, userNotes }})
    };

    return (
        <>
            {/* if there are notes, show them, if not, the user will see the create note state */}
            {userNotes ? (
                <div className="main-container  ">
                    <h3>My Notes</h3>
                    <div className="search-and-import">
                        <div className="search-box-container">
                            <svg className="search-box-icon" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#909090" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"></path></svg>
                            <input
                                type="search"
                                placeholder="Search by name of the document"
                                className="search-box" />
                        </div>
                        <button
                            type="button"
                            className="createNote btn-primary rounded"
                            style={{ display: userNotes ? "block" : "none" }}
                            onClick={handleAddNote}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"></path></svg>
                        </button>
                    </div>
                    {/* grid for notes */}
                    <div className="all-notes-container">
                        {userNotes.map((note, i) => (
                            <div
                                key={note.id} // Adding a unique key prop here
                                className={`note-card ${colorClasses[i % colorClasses.length]}`}
                                onClick={() => handleOpenNote(note)}
                            >
                                <p className="font-normal bold">{note.title}</p>
                                <p className="font-small">{note.description}</p>
                            </div>
                        ))}
                    </div>
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