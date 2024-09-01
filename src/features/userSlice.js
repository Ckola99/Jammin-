import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const url = 'https://accounts.spotify.com/api/token'

const initialState = {
	isAuthenticated: false,
	userInfo: null,
	status: 'idle',
	error: null,
};

// Create an async thunk for Spotify authentication
export const authenticateUser = createAsyncThunk(
	'user/authenticateUser',
	async (code, { rejectWithValue }) => {
		const codeVerifier = localStorage.getItem('code_verifier');
		if (!codeVerifier) {
			return rejectWithValue('No code verifier found.');
		}

		const payload = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				client_id: clientId,
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri,
				code_verifier: codeVerifier,
			}),
		};

		try {
			const body = await fetch(url, payload);
			const response = await body.json();

			if (!body.ok) {
				console.error('Error response:', response);
				throw new Error(response.error_description || 'Failed to exchange authorization code for access token');
			}

			const accessToken = response.access_token;

			spotifyApi.setAccessToken(accessToken);
			localStorage.setItem('access_token', accessToken);

			const userInfo = await spotifyApi.getMe();
			return userInfo;
		} catch (error) {
			console.error('Authentication error:', error.message);
			return rejectWithValue(error.message);
		}
	}
);



const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			state.isAuthenticated = false;
			state.userInfo = null;
			state.status = 'idle';
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(authenticateUser.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(authenticateUser.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.userInfo = action.payload;
				state.status = 'succeeded';
			})
			.addCase(authenticateUser.rejected, (state, action) => {
				state.isAuthenticated = false;
				state.userInfo = null;
				state.status = 'failed';
				state.error = action.payload;
			});
	},
});

export const { logout } = userSlice.actions;
export const user = (state) => state.user.userInfo;
export const isAuthenticated = (state) => state.user.isAuthenticated;
export const authStatus = (state) => state.user.status;
export const authError = (state) => state.user.error;
export default userSlice.reducer;
