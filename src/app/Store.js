import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import recommendationsReducer from '../features/recommendationsSlice';


export const store = configureStore({
	reducer: {
		user: userReducer,
		recommendations: recommendationsReducer,
	},
});

export default store;
