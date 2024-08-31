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


	return <div>Login</div>;
};
export default Login;
