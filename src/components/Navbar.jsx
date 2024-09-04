import { useSelector } from "react-redux";
import { user, isAuthenticated } from "../features/userSlice";
import React from 'react';


const Navbar = () => {
	const profile = useSelector(user);
	const navList = ["Jammin'", "Playlists", "Assistant"]
	const grantedAccess =  useSelector(isAuthenticated)
	const expirationTime = localStorage.getItem('token_expiration_time')
	console.log(expirationTime)

	console.log(profile);
	return (
		<div className="max-lg:pl-[22px] pt-[30px] shadow-lg shadow-black pb-5">
			<nav className="">
				<div className="flex justify-items-center gap-3">
					{grantedAccess && (
						<img
							src={
								profile
									.images[0]
									.url
							}
							alt="profile pic"
							className="w-[35px] h-[35px] rounded-full object-cover"
						/>
					)}
					<h1 className="text-transform: uppercase text-2xl">
						ja
						<span className=" bg-gradient-to-r from-[#1ED760] via-[#00FFAF] to-[#008F4C]  bg-clip-text text-transparent">
							mm
						</span>
						in'
					</h1>
					<p>{expirationTime}</p>
				</div>
				<div className=" flex gap-2 hover:cursor-pointer mt-10">
					{navList.map((navItem, index) => (
						<div
							className="w-[89px] h-[30px] bg-gradient-to-r from-[#4b4b4b] via-[#535353] to-[#6b6b6b] rounded-[20px] flex-center"
							key={index}
						>
							{navItem}
						</div>
					))}
				</div>
			</nav>
		</div>
	);
};
export default Navbar;
