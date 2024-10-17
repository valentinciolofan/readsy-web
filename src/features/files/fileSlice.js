import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uploadedFiles: [],
  processingStatus: 'idle', // idle | uploading | completed
};

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    uploadFile(state, action) {
      state.uploadedFiles.push(action.payload);
      state.processingStatus = 'uploading';
    },
    uploadComplete(state, action) {
      state.processingStatus = 'completed';
      // handle GPT results if necessary
    },
  },
});

export const { uploadFile, uploadComplete } = fileSlice.actions;
export default fileSlice.reducer;
