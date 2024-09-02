import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticateUser } from "../features/userSlice";

const Callback = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchToken = async () => {
			const urlParams = new URLSearchParams(
				window.location.search
			);
			let code = urlParams.get("code");

			if (code) {
				try {
					await dispatch(
						authenticateUser(code)
					).unwrap();
					navigate("/");
				} catch (error) {
					console.error(
						"Authentication failed: ",
						error.message
					);
				}
			}
		};

		fetchToken();
	}, [dispatch, navigate]); //dependency array contents is good practice recommended by react.

	return (
		<div>
			<p className="text-red-400">loading...</p>
		</div>
	);
};
export default Callback;
