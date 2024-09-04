import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SpotifyWebApi from 'spotify-web-api-js';
import { supabase } from '../utils/supabaseClient';

const spotifyApi = new SpotifyWebApi();

const initialState = {
	tracks: [],
	likedTracks: [],
	dislikedTracks: [],
	status: 'idle',
}


export const fetchRecommendations = createAsyncThunk(
	'recommendations/fetchRecommendations',
	async ({ genre='' }, { rejectWithValue }) => {

		const accessToken = localStorage.getItem('access_token');

		if (!accessToken) {
			return rejectWithValue('No access token found.');
		}

		try {
			spotifyApi.setAccessToken(accessToken);

			const options = genre ? { seed_genres: genre } : {};
			const recommendations = await spotifyApi.getRecommendations(options);
			return recommendations.body.tracks;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const recommendationsSlice = createSlice({
	name: 'recommendations',
	initialState,

})
