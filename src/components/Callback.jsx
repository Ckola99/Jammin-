import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const Callback = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchToken = async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get('code');
			const codeVerifier = localStorage.getItem('code_verifier');

			const response = await fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					grant_type: 'authorization_code', code,
					redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
					code_verifier: codeVerifier,
					client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
					client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
				}),
			});

			const data = await response.json();

			spotifyApi.setAccessToken(data.access_token);
			localStorage.setItem('access_token', data.access_token);

			const userInfo = await spotifyApi.getMe();
			dispatch(login(userInfo));
			navigate('/');
		};

		fetchToken();
	}, [dispatch, navigate]); //dependency array contents is good practice recommended by react.

	return (
    <div>Calling back...</div>
  )
}
export default Callback
