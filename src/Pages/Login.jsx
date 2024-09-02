import React, { useEffect, useRef } from "react";
import { authStatus } from "../features/userSlice";
import { useSelector } from "react-redux";
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

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
	const textRef = useRef(null);

	useEffect(() => {
		if (textRef.current) {
			const timeline = gsap.timeline({ repeat: -1});

			const text = "Your AI playlist assistant.";
			const duration = text.length * 0.2;

			timeline.to(textRef.current, {
				duration,
				text: text,
				ease: "none",
				repeat: 1,
				yoyo: true
			});
		}
	}, []);

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
				<div className="flex-center flex-col h-[100vh] relative">
					<h1 className="text-transform: uppercase text-4xl">
						ja
						<span className=" bg-gradient-to-r from-[#1ED760] via-[#00FFAF] to-[#008F4C]  bg-clip-text text-transparent">
							mm
						</span>
						in'
					</h1>
					<p
						ref={textRef}
						className="text-2xl"
					></p>
					<button
						className="bg-gradient-to-r from-[#1ED760] via-[#00FFAF] to-[#008F4C] mt-10 text-2xl text-black font-bold w-[289px] h-[77px] rounded-[38px] shadow shadow-white"
						onClick={handleLogin}
					>
						Sign-in with Spotify
					</button>
					<p className="absolute bottom-[10px] opacity-50">
						powered by Spotify and OpenAI
					</p>
				</div>
			)}
		</div>
	);
};
export default Login;
