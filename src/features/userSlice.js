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
			const refreshToken = response.refresh_token;
			const expiresIn = response.expires_in;

			const expirationTime = new Date().getTime() + expiresIn * 1000;

			spotifyApi.setAccessToken(accessToken);
			localStorage.setItem('access_token', accessToken);
			localStorage.setItem('refresh_token', refreshToken);
			localStorage.setItem('token_expiration_time', expirationTime);

			const userInfo = await spotifyApi.getMe();
			return userInfo;
		} catch (error) {
			console.error('Authentication error:', error.message);
			return rejectWithValue(error.message);
		}
	}
);

// Async function to refresh the access token
export const getRefreshToken = async () => {
	const refreshToken = localStorage.getItem('refresh_token');
	if (!refreshToken) {
		console.error('No refresh token found.');
		return;
	}

	const payload = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: clientId,
		}),
	};

	try {
		const body = await fetch(url, payload);
		const response = await body.json();

		if (!body.ok) {
			console.error('Error response:', response);
			throw new Error(response.error_description || 'Failed to refresh access token');
		}

		const accessToken = response.access_token;
		const newRefreshToken = response.refresh_token;
		const expiresIn = response.expires_in;

		const expirationTime = new Date().getTime() + expiresIn * 1000;

		spotifyApi.setAccessToken(accessToken);
		localStorage.setItem('access_token', accessToken);
		localStorage.setItem('token_expiration_time', expirationTime);
		if (newRefreshToken) {
			localStorage.setItem('refresh_token', newRefreshToken);
		}

		return accessToken;
	} catch (error) {
		console.error('Refresh token error:', error.message);
	}
};


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
