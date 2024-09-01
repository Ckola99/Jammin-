import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Callback from "../components/Callback";
import { useSelector } from "react-redux";
import { isAuthenticated, authStatus } from "../features/userSlice";

function App() {
	const grantedAccess = useSelector(isAuthenticated);
	const status = useSelector(authStatus);

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
					<Route
						path="/"
						element={<div></div>}
					/>
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
