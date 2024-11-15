import { createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig';

// Fetch notes
export const fetchUserNotes = createAsyncThunk(
    'notes/fetchUserNotes',
    async (userId, { rejectWithValue }) => {
        try {
            console.log("User ID:", userId);
            const q = query(collection(db, "notes"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            const notes = [];
            querySnapshot.forEach((doc) => {
                notes.push({ id: doc.id, ...doc.data() });
            });

            console.log("Fetched notes:", notes); // Log all fetched notes for debugging
            return notes;
        } catch (error) {
            console.error("Error fetching notes:", error.message);
            return rejectWithValue(error.message);
        }
    }
);

// Add a note
export const addUserNote = createAsyncThunk(
    'notes/addUserNote',
    async ({ userId, note }, { rejectWithValue }) => {
        try {
            console.log('idk::', userId);
            console.log(note);
            if (!userId) {
                console.error('User ID is missing');
                return rejectWithValue('User ID is missing');
            }
            console.log('Adding note with user ID:', userId);

            const noteRef = await addDoc(collection(db, 'notes'), { userId, ...note });
            console.log('Note added with ID:', noteRef.id);

            return { id: noteRef.id, ...note };
        } catch (error) {
            console.error('Error adding note:', error.message);
            return rejectWithValue(error.message);
        }
    }
);


// Edit a note
export const editUserNote = createAsyncThunk(
    'notes/editUserNote',
    async ({ noteId, note }, { rejectWithValue }) => {
        try {
            const noteRef = doc(db, 'notes', noteId);
            await updateDoc(noteRef, note);
            console.log('Updated note in Firestore:', { id: noteId, ...note });
            return { id: noteId, ...note }; // Ensure this structure includes id
        } catch (error) {
            console.error('Error updating note:', error.message);
            return rejectWithValue(error.message);
        }
    }
);


// Delete one or multiple notes
export const deleteUserNotes = createAsyncThunk(
    'notes/deleteUserNotes',
    async (noteIds, { rejectWithValue }) => {
        try {
            const batch = db.batch();
            noteIds.forEach((noteId) => {
                const noteRef = db.collection('notes').doc(noteId);
                batch.delete(noteRef);
            });
            await batch.commit();
            return noteIds;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
