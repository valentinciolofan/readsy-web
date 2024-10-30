import { createSlice } from '@reduxjs/toolkit';

const pdfSlice = createSlice({
    name: 'pdf',
    initialState: {
        pdfText: "", // Initialize pdfText to an empty string
    },
    reducers: {
        _setPdfText(state, action) {
            state.pdfText = action.payload; // Directly set pdfText from action payload
        },
    },
});

// Export the action created by createSlice for use in components
export const { _setPdfText } = pdfSlice.actions;

// Export the reducer to be used in the store configuration
export default pdfSlice.reducer;
