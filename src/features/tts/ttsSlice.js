import { createSlice } from '@reduxjs/toolkit';

const ttsSlice = createSlice({
    name: 'tts',
    initialState: {
        readAloud: null,
    },
    reducers: {
        startTTS(state) {
            state.readAloud = true;
        },
        stopTTS(state) {
            state.readAloud = false;
            window.speechSynthesis.cancel();
        },
    },
});

export const { startTTS, stopTTS } = ttsSlice.actions;
export default ttsSlice.reducer;
