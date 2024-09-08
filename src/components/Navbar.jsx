import { useSelector } from "react-redux";
import { user } from "../features/userSlice";
import React from 'react';
import { NavLink } from 'react-router-dom';


const Navbar = () => {
	const profile = useSelector(user);
	const navLinks = [
		{ name: "Jammin'", path: "/" },
		{ name: "Playlists", path: "/playlists" },
		{ name: "Assistant", path: "/assistant" },
	];

	return (
		<div className="max-lg:pl-[22px] pt-[30px] shadow-lg shadow-black pb-5">
			<nav className="">
				<div className="flex justify-items-center gap-3">
					{profile?.images?.length > 0 ? (
						<img
							src={
								profile
									.images[0]
									.url
							}
							alt="profile pic"
							className="w-[35px] h-[35px] rounded-full object-cover"
						/>
					) : (
						<div className="w-[35px] h-[35px] rounded-full bg-gray-300"></div>
					)}
					<h1 className="text-transform: uppercase text-2xl">
						ja
						<span className=" bg-gradient-to-r from-[#1ED760] via-[#00FFAF] to-[#008F4C]  bg-clip-text text-transparent">
							mm
						</span>
						in'
					</h1>
				</div>
				<div className="flex gap-2 mt-10">
					{navLinks.map((link, index) => (
						<NavLink
							to={link.path}
							key={index}
							className={({
								isActive,
							}) =>
								`w-[89px] h-[30px] rounded-[20px] flex-center font-bold ${
									isActive
										? "bg-[#1ED760] text-black"
										: "bg-gradient-to-r from-[#4b4b4b] via-[#535353] to-[#6b6b6b]"
								}`
							}
						>
							{link.name}
						</NavLink>
					))}
				</div>
			</nav>
		</div>
	);
};
export default Navbar;
