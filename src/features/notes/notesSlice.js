// import { createSlice } from '@reduxjs/toolkit';

// const notesSlice = createSlice({
//     name: 'notes',
//     initialState: {
//         userNotes: [],
//     },
//     reducers: {
//         setNotes(state, action) {
//             state.userNotes = action.payload;
//         },
//         addNote(state, action) {
//             state.userNotes.push(action.payload);
//         },
//         clearNotes(state) {
//             state.userNotes = [];
//         },
//     },
// });

// export const { setNotes, addNote, clearNotes } = notesSlice.actions;
// export default notesSlice.reducer;


// notesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        userNotes: [],
    },
    reducers: {
        setNotes(state, action) {
            state.userNotes = action.payload;
        },
        addNote(state, action) {
            state.userNotes.push(action.payload);
        },
        editNote(state, action) {
            const { id, updatedNote } = action.payload;
            const noteIndex = state.userNotes.findIndex(note => note.id === id);
            if (noteIndex !== -1) {
                state.userNotes[noteIndex] = { ...state.userNotes[noteIndex], ...updatedNote };
            }
        },
        deleteNote(state, action) {
            const id = action.payload;
            state.userNotes = state.userNotes.filter(note => note.id !== id);
        },
    },
});

export const { setNotes, addNote, editNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
