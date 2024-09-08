import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Callback from "../components/Callback";
import { useSelector, useDispatch } from "react-redux";
import {
	isAuthenticated,
	authStatus,
	getRefreshToken,
	fetchUserInfo, logout
} from "../features/userSlice";
import Layout from "../components/Layout";
import Playlists from "../Pages/Playlists";

function App() {
	const grantedAccess = useSelector(isAuthenticated);
	const status = useSelector(authStatus);
	const dispatch = useDispatch();

	useEffect(() => {
		if (grantedAccess) {
			console.log('info dispatched with code')
			dispatch(fetchUserInfo());
		}
	}, [grantedAccess, dispatch]);

	useEffect(() => {
		const checkTokenExpiration = async () => {
			const expirationTime = localStorage.getItem(
				"token_expiration_time"
			);
			const currentTime = new Date().getTime();

			if (!expirationTime || currentTime > expirationTime) {
				dispatch(logout());
				return;
			}

			const timeLeft = expirationTime - currentTime;
			const refreshTime = timeLeft - 5 * 60 * 1000; // Refresh 5 minutes before expiration

			const timeoutId = setTimeout(async () => {
				const accessToken = await getRefreshToken();
				if (!accessToken) {
					dispatch(logout());
				} else {
					const newExpirationTime =
						currentTime +
						parseInt(
							localStorage.getItem(
								"expires_in"
							)
						);
					localStorage.setItem(
						"token_expiration_time",
						newExpirationTime
					);

					// Set a timer to logout after the token is refreshed
					setTimeout(() => {
						dispatch(logout());
					}, parseInt(localStorage.getItem("expires_in"))); // Timer set for the duration of the new token
				}
			}, refreshTime);

			return () => clearTimeout(timeoutId);
		};

		checkTokenExpiration();
	}, [dispatch]);



	return (
		<Router>
			<Routes>
				{/* Public Routes */}
				<Route path="/login" element={<Login />} />
				<Route
					path="/callback"
					element={<Callback />}
				/>

				{/* Protected Routes */}
				<Route path="/" element={<Layout />}>
					<Route
						index
						element={
							grantedAccess ? (
								<Home />
							) : (
								<Navigate to="/login" />
							)
						}
					/>
					<Route
						path="playlists"
						element={
							grantedAccess ? (
								<Playlists />
							) : (
								<Navigate to="/login" />
							)
						}
					/>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
