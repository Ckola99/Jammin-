import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SpotifyWebApi from 'spotify-web-api-js';
import { supabase } from '../utils/supabaseClient';

const spotifyApi = new SpotifyWebApi();
const accessToken = localStorage.getItem('access_token');

const initialState = {
	tracks: [],
	likedTracks: [],
	dislikedTracks: [],
	topArtists: [],
	status: 'idle',
	error: null,
};

//fetch song recommendations
export const fetchSongRecommendations = createAsyncThunk(
	'recommendations/fetchSongRecommendations',
	async (_, { rejectWithValue, getState }) => {

		const accessToken = localStorage.getItem('access_token');

		if (!accessToken) {
			return rejectWithValue('No access token found.');
		}

		const state = getState();
		const topArtists = state.recommendations.topArtists;

		if (!topArtists || topArtists.length === 0) {
			return rejectWithValue('No top genres available for recommendations.')
		}


		try {
			spotifyApi.setAccessToken(accessToken);
			const artistSeeds = topArtists.map((artist) => artist.id).slice(0, 5);

			const response = await spotifyApi.getRecommendations({
        		seed_artists: artistSeeds, // Use artist seeds
        		limit: 20, // Specify how many tracks to return
     			});

			// Handle the response format to ensure it's JSON
			if (!response || !response.tracks) {
				return rejectWithValue('Invalid response from Spotify API.');
			}

			console.log('response:', response);

			return response.tracks;
		} catch (error) {
			// Check for rate limiting
			if (error.status === 429) {
				const retryAfter = error.headers['retry-after'] || 1;
				return rejectWithValue(`Rate limit hit. Retry after ${retryAfter} seconds.`);
			}
			return rejectWithValue(error.message);
		}
	}
);

//fetch top genres
export const fetchTopArtists = createAsyncThunk(
	'recommendations/fetchTopGenres',
	async (_, { rejectWithValue }) => {

		const accessToken = localStorage.getItem('access_token');

		if (!accessToken) {
			rejectWithValue('No access token found.');
		}

		try {
			spotifyApi.setAccessToken(accessToken);
			const response = await spotifyApi.getMyTopArtists();

			const topArtists = response.items.slice(0, 5).map((artist) => ({
				id: artist.id,
				name: artist.name,
			}));

			console.log('Top artists:', topArtists)
			return topArtists;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
)

const recommendationsSlice = createSlice({
	name: 'recommendations',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSongRecommendations.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchSongRecommendations.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.tracks = action.payload;

			})
			.addCase(fetchSongRecommendations.rejected, (state, action) => {
				state.status = 'failed'; // Update status to 'failed'
				state.error = action.payload; // Store the error message
			})
			.addCase(fetchTopArtists.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchTopArtists.fulfilled, (state, action) => {
				state.topArtists = action.payload; // Store the fetched top genres
				state.status = 'succeeded';
			})
			.addCase(fetchTopArtists.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload;
			});
	},
})

export default recommendationsSlice.reducer;
export const fetchStatus = (state) => state.recommendations.status;
export const songsRecommended = (state) => state.recommendations.tracks
export const topGenresSelector = (state) => state.recommendations.topGenres;
export const topArtistsSelector = (state) => state.recommendations.topArtists;
