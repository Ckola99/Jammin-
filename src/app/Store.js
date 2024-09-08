import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import recommendationsReducer from '../features/recommendationsSlice';
import playbackReducer from '../features/playbackSlice';


export const store = configureStore({
	reducer: {
		user: userReducer,
		recommendations: recommendationsReducer,
		playback: playbackReducer,
	},
});

export default store;
