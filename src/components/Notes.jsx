import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setNotes, addNote, editNote, deleteNote } from "../features/notes/notesSlice";
import Note from "./Note";

const initialNotes = [
    {
        id: 1,
        title: "How to Get Started with React",
        description: "Learn the basics of building a React application from setting up your environment to creating your first component."
    },
    {
        id: 2,
        title: "Understanding JavaScript Closures",
        description: "Closures are a powerful concept in JavaScript. This article explains what they are and how to use them effectively in your code."
    },
    {
        id: 3,
        title: "Introduction to CSS Grid Layout",
        description: "CSS Grid Layout is a 2D layout system for the web. Discover how to use it to create complex, responsive layouts easily."
    },
    {
        id: 4,
        title: "Building a REST API with Node.js",
        description: "A step-by-step guide on building a simple REST API using Node.js and Express, complete with routing and middleware."
    },
    {
        id: 5,
        title: "Improving Web Performance",
        description: "Tips and tricks to make your website faster and more efficient, from optimizing images to leveraging browser caching."
    },
    {
        id: 6,
        title: "Understanding Flexbox in CSS",
        description: "Flexbox is a powerful layout module in CSS. Learn how to use it to create flexible and responsive web layouts."
    },
    {
        id: 7,
        title: "Getting Started with Firebase Authentication",
        description: "Learn how to integrate Firebase Authentication into your web app to easily handle user login and registration."
    },
    {
        id: 8,
        title: "State Management in React with Redux",
        description: "This guide explores how Redux helps manage state in larger React applications, providing a predictable state container."
    },
    {
        id: 9,
        title: "Debugging JavaScript Applications",
        description: "Effective debugging techniques for JavaScript developers using browser tools and popular libraries like Node Inspector."
    },
    {
        id: 10,
        title: "Best Practices for Writing Clean Code",
        description: "Writing clean, maintainable code is key to long-term success. Discover best practices that can help improve code quality."
    }
];
const colorClasses = ["green", "blue", "orange", "purple"];

const Notes = () => {
    const dispatch = useDispatch((state) => state.notes.userNotes);
    const navigate = useNavigate();
    const notes = useSelector((state) => state.notes.userNotes);
    console.log(notes)
    useEffect(() => {
        dispatch(setNotes(initialNotes));
    }, [dispatch])


    // const handleCreateNote = () => {
    //     setNotes(true);
    // }

    const handleOpenNote = (noteId) => {
        navigate(`/dashboard/notes/note/${noteId}`)
    };

    return (
        <>
            {/* if there are notes, show them, if not, the user will see the create note state */}
            {notes ? (
                <div className="main-container">
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
                            className="import btn-primary rounded"
                            style={{ display: notes ? "block" : "none" }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"></path></svg>
                        </button>
                    </div>
                    {/* grid for notes */}
                    <div className="all-notes-container">
                        {notes.map((note, i) =>
                            <div 
                                className={`note-card ${colorClasses[i % colorClasses.length]}`}
                                onClick={() => handleOpenNote(note.id)}>
                                <p className="font-normal bold">{note.title}</p>
                                <p className="font-small">{note.description}</p>
                            </div>)
                        }

                    </div>
                </div>
            ) : (

                <div className="dashboard-zero-files">
                    <h3>It seems that you don’t have any notes yet.</h3>
                    <button
                        type='button'
                        className="btn-primary"
                        onClick={handleCreateNote}
                    >Create note</button>
                </div>
            )}
        </>
    );
};

export default Notes;