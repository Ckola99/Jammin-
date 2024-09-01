import React from "react";
import { useNavigate } from "react-router-dom";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const scope = 'user-read-private user-read-email';

const generateCodeVerifier = () => {
	const array = new Uint32Array(56);
	window.crypto.getRandomValues(array);
	return array.join('');
};

const base64UrlEncode = (str) => {
	return btoa(str)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
};

const generateCodeChallenge = async (codeVerifier) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return base64UrlEncode(String.fromCharCode(...new Uint8Array(digest)));
};
const Login = () => {
	const navigate = useNavigate();

	const handleLogin = async () => {
		const codeVerifier = generateCodeVerifier();
		const codeChallenge = await generateCodeChallenge(codeVerifier);

		localStorage.setItem('code_verifier', codeVerifier);

		window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256`
	}


	return <button onClick={handleLogin}>Login with Spotify</button>;
};
export default Login;
