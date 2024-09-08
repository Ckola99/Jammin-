import { createSlice } from '@reduxjs/toolkit';


const initialState = {
	currentTrack: null,
	isPlaying: false,
}

export const playbackSlice = createSlice({
	name: 'playback',
	initialState,
	reducers: {
		playTrack: (state, action) => {
			state.currentTrack = action.payload;
			state.isPlaying = true;
		},
		pauseTrack: (state) => {
			state.isPlaying = false;
		},
		stopTrack: (state) => {
			state.currentTrack = null;
			state.isPlaying = false;
		},
	},
});

export const { playTrack, pauseTrack, stopTrack } = playbackSlice.actions;
export default playbackSlice.reducer;
