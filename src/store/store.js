import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import fileReducer from '../features/files/fileSlice';
import pdfReducer from "../features/pdf/pdfReducer";
import notesReducer from "../features/notes/notesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    pdfReducer: pdfReducer,
    notes: notesReducer
  },
});

export default store;