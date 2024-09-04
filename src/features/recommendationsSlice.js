import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SpotifyWebApi from 'spotify-web-api-js';
import { supabase } from '../utils/supabaseClient';

const spotifyApi = new SpotifyWebApi();

const initialState = {
	tracks: [],
	likedTracks: [],
	dislikedTracks: [],
	status: 'idle',
	error: null,
};

export const fetchRecommendations = createAsyncThunk(
	'recommendations/fetchRecommendations',
	async ({ genre = '' }, { rejectWithValue }) => {
		const accessToken = localStorage.getItem('access_token');

		if (!accessToken) {
			return rejectWithValue('No access token found.');
		}

		try {
			spotifyApi.setAccessToken(accessToken);

			const options = genre ? { seed_genres: genre } : {};
			const recommendations = await spotifyApi.getRecommendations(options);
			return recommendations.tracks;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const updateUserPreferences = createAsyncThunk(
	'recommendations/updateUserPreferences',
	async ({ userId, trackId, liked }, { rejectWithValue }) => {
		try {
			const { data, error } = await supabase
				.from('user_preferences')
				.upsert({
					user_id: userId,
					track_id: trackId,
					liked,
					created_at: new Date(),
				});

			if (error) throw error;

			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const addTrackToPlaylist = createAsyncThunk(
	'recommendations/addTrackToPlaylist',
	async ({ playlistId, trackId }, { rejectWithValue }) => {
		try {
			const { data, error } = await supabase
				.from('playlist_tracks')
				.insert({
					playlist_id: playlistId,
					track_id: trackId,
					added_at: new Date(),
				});

			if (error) throw error;

			return data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const recommendationsSlice = createSlice({
	name: 'recommendations',
	initialState,
	reducers: {
		addLikedTrack: (state, action) => {
			state.likedTracks.push(action.payload);
		},
		addDislikedTrack: (state, action) => {
			state.dislikedTracks.push(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRecommendations.pending, (state) => {
				state.status = 'loading';
				state.error = null;
			})
			.addCase(fetchRecommendations.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.tracks = action.payload;
			})
			.addCase(fetchRecommendations.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.payload || 'Failed to fetch recommendations';
			});
	},
});

export const { addLikedTrack, addDislikedTrack } = recommendationsSlice.actions;

export default recommendationsSlice.reducer;
