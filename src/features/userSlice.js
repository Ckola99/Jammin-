import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isAuthenticated: false,
	userInfo: null,
}

const userSlice = createSlice ({
	name: 'user',
	initialState,
	reducers: {
		login: (state, action) => {
			state.isAuthenticated = true;
			state.userInfo = action.payload;
		},
		logout: (state) => {
			state.isAuthenticated = false;
			state.userInfo = null;
		}
	}
})

export const { login, logout } = userSlice.actions;
export const user = (state) => state.user.userInfo;
export const isAuthenticated = (state) => state.user.isAuthenticated;
export default userSlice.reducer;
