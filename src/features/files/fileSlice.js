import { createSlice } from "@reduxjs/toolkit";
import { uploadFiles, fetchFiles, deleteFiles } from "../../firebase/firestore/firestoreAsyncThunk";

const filesSlice = createSlice({
  name: "files",
  initialState: {
    files: [], // Array to hold uploaded files metadata
    loading: false, // Indicates if any operation is in progress
    error: null, // Holds error message if any operation fails
    isDeleting: false, // Tracks deletion operation
    fetched: false, // Tracks if files are successfully fetched
  },
  reducers: {}, // Add additional reducers here if needed
  extraReducers: (builder) => {
    builder
      /* ===== Upload Files ===== */
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset errors
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files.push(...action.payload); // Append uploaded files to state
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store upload error
      })

      /* ===== Fetch Files ===== */
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset errors
        state.fetched = false; // Set fetched flag to false
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false; 
        state.files = action.payload; // Replace state with fetched files
        state.fetched = true; // Set fetched flag to true
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store fetch error
        state.fetched = false;
      })

      /* ===== Delete Files ===== */
      .addCase(deleteFiles.pending, (state) => {
        state.isDeleting = true; // Start deleting
        state.error = null; // Reset errors
      })
      .addCase(deleteFiles.fulfilled, (state, action) => {
        state.isDeleting = false; // End deletion
        // Remove deleted files from state
        state.files = state.files.filter((file) => !action.payload.includes(file.id));
      })
      .addCase(deleteFiles.rejected, (state, action) => {
        state.isDeleting = false; // End deletion
        state.error = action.payload; // Store delete error
      });
  },
});

export default filesSlice.reducer;
