import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
import SpotifyWebApi from "spotify-web-api-js";
import { useNavigate } from "react-router-dom";

const spotifyApi = new SpotifyWebApi();

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			const userInfo = await spotifyApi.getMe();
			dispatch(login(userInfo));
		} catch (error) {
			console.error("Error logging in:", error);
		}
	};

	return <div>Login</div>;
};
export default Login;
