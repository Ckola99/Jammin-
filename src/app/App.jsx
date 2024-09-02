import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Callback from "../components/Callback";
import { useSelector, useDispatch } from "react-redux";
import {
	isAuthenticated,
	authStatus,
	getRefreshToken,
	fetchUserInfo,
} from "../features/userSlice";

function App() {
	const grantedAccess = useSelector(isAuthenticated);
	const status = useSelector(authStatus);
	const dispatch = useDispatch();

	useEffect(() => {
		if (grantedAccess) {
			dispatch(fetchUserInfo());
		}
	}, [grantedAccess, dispatch]);

	useEffect(() => {
		// Check token expiration time and set up a refresh timer
		const setupTokenRefresh = () => {
			const expirationTime = localStorage.getItem(
				"token_expiration_time"
			);
			if (!expirationTime) return;

			const currentTime = new Date().getTime();
			const timeLeft = expirationTime - currentTime;

			if (timeLeft > 0) {
				// Refresh the token 5 minutes before it expires
				const refreshTime = timeLeft - 5 * 60 * 1000;

				const timeoutId = setTimeout(async () => {
					const accessToken =
						await getRefreshToken();
					if (accessToken) {
						console.log(
							"Access token refreshed"
						);
					} else {
						console.error(
							"Failed to refresh access token"
						);
					}
				}, refreshTime);

				// Return a cleanup function to clear the timeout
				return () => {
					clearTimeout(timeoutId);
				};
			}
		};

		// Call the setup function
		const cleanup = setupTokenRefresh();

		// Return cleanup function from useEffect
		return () => {
			if (cleanup) cleanup();
		};
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
				{/* Show a loading indicator if auth status is still being checked */}
				{status === "loading" ? (
					<Route path="/" element={<div></div>} />
				) : (
					<Route
						path="/"
						element={
							grantedAccess ? (
								<Home />
							) : (
								<Navigate to="/login" />
							)
						}
					/>
				)}
			</Routes>
		</Router>
	);
}

export default App;
