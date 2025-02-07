import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import fileReducer from '../features/files/fileSlice';
import pdfReducer from "../features/pdf/pdfReducer";
import notesReducer from "../features/notes/notesSlice";
import ttsReducer from '../features/tts/ttsSlice';
import filesReducer from '../features/files/fileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    pdf: pdfReducer,
    notes: notesReducer,
    tts: ttsReducer,
    files: filesReducer,
  },
});

export default store;