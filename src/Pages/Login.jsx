import React from "react";
import { authStatus } from "../features/userSlice";
import { useSelector } from "react-redux";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const scope =
	"user-read-private user-read-email playlist-read-private playlist-modify-public";
const authUrl = new URL("https://accounts.spotify.com/authorize");

const generateRandomString = (length) => {
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce(
		(acc, x) => acc + possible[x % possible.length],
		""
	);
};

const sha256 = async (plain) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input) => {
	return btoa(String.fromCharCode(...new Uint8Array(input)))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
};

const Login = () => {
	const status = useSelector(authStatus);

	const handleLogin = async () => {
		const codeVerifier = generateRandomString(64);
		const hashed = await sha256(codeVerifier);
		localStorage.setItem("code_verifier", codeVerifier);
		const codeChallenge = base64encode(hashed);

		const params = {
			response_type: "code",
			client_id: clientId,
			scope,
			code_challenge_method: "S256",
			code_challenge: codeChallenge,
			redirect_uri: redirectUri,
		};

		authUrl.search = new URLSearchParams(params).toString();
		window.location.href = authUrl.toString();
	};

	return (
		<div>
			{status === "loading" ? (
				<p>Loading...</p>
			) : (
				<button onClick={handleLogin}>
					Login with Spotify
				</button>
			)}
		</div>
	);
};
export default Login;
