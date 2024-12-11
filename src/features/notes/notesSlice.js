import { createSlice } from '@reduxjs/toolkit';
import { fetchUserNotes, addUserNote, editUserNote, deleteUserNotes } from '../../firebase/firestore/notes/firestoreAsyncThunk';

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        userNotes: [],
        loading: false,
        error: null,
    },
    reducers: {
        setNotes(state, action) {
            state.userNotes = action.payload;
        },
        clearNotes(state) {
            state.userNotes = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.userNotes = action.payload;
            })
            .addCase(fetchUserNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUserNote.fulfilled, (state, action) => {
                // state.userNotes.push(action.payload);
            })
            .addCase(editUserNote.fulfilled, (state, action) => {
                console.log('Action payload:', action.payload); // Check payload structure
                console.log('Current state.userNotes:', state.userNotes); // Check existing notes in state
            
                const index = state.userNotes.findIndex(note => note.id === action.payload.id);
                console.log('Found index:', index); // Log the index found
                if (index !== -1) {
                    state.userNotes[index] = action.payload;
                } else {
                    console.warn(`Note with ID ${action.payload.id} not found`);
                }
            })
            .addCase(deleteUserNotes.fulfilled, (state, action) => {
                state.userNotes = state.userNotes.filter(note => !action.payload.includes(note.id));
            });
    },
});

export const { setNotes, clearNotes } = notesSlice.actions;
export default notesSlice.reducer;
