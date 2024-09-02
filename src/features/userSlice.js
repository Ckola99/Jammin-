import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const url = 'https://accounts.spotify.com/api/token'

const initialState = {
	isAuthenticated: !!localStorage.getItem('access_token'),
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
				code_verifier: localStorage.getItem('code_verifier'),
			}),
		};

		try {
			const body = await fetch(url, payload);
			const response = await body.json();

			if (!body.ok) {
				console.error('Error response:', response);
				throw new Error(response.error_description || 'Failed to exchange authorization code for access token');
			}

			const { access_token, refresh_token, expires_in } = response;
			const expirationTime = new Date().getTime() + expires_in * 1000;

			spotifyApi.setAccessToken(access_token);
			localStorage.setItem('access_token', access_token);
			localStorage.setItem('refresh_token', refresh_token);
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

		const { access_token, refresh_token, expires_in } = data;
		const expirationTime = new Date().getTime() + expires_in * 1000;

		spotifyApi.setAccessToken(access_token);
		localStorage.setItem('access_token', access_token);
		localStorage.setItem('token_expiration_time', expirationTime);
		if (refresh_token) {
			localStorage.setItem('refresh_token', refresh_token);
		}


		return access_token;
	} catch (error) {
		console.error('Refresh token error:', error.message);
	}
};

// Async thunk to fetch user info
export const fetchUserInfo = createAsyncThunk(
	'user/fetchUserInfo',
	async (_, { rejectWithValue }) => {
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			return rejectWithValue('No access token found.');
		}

		try {
			spotifyApi.setAccessToken(accessToken);
			const userInfo = await spotifyApi.getMe();
			return userInfo;
		} catch (error) {
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
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			localStorage.removeItem('token_expiration_time');
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
			})
			.addCase(fetchUserInfo.fulfilled, (state, action) => {
				state.userInfo = action.payload;
			});
	},
});

export const { logout } = userSlice.actions;
export const user = (state) => state.user.userInfo;
export const isAuthenticated = (state) => state.user.isAuthenticated;
export const authStatus = (state) => state.user.status;
export const authError = (state) => state.user.error;
export default userSlice.reducer;
