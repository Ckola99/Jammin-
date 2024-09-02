import { useSelector } from "react-redux";
import { user } from "../features/userSlice";
import react from '../assets/react.svg'

const Navbar = () => {
	const profile = useSelector(user);
	const navList = ["Jammin'", "Playlists", "Assistant"]

	console.log(profile);
	return (
		<header className="max-lg:ml-[22px] mt-[30px] ">
			<nav>
				<div className="flex justify-items-center gap-3">
					<img
						src={profile.images[0]?.url}
						alt="profile pic"
						className="w-[35px] h-[35px] rounded-full object-cover"
					/>
					<h1 className="text-transform: uppercase text-2xl">
						ja
						<span className=" bg-gradient-to-r from-[#1ED760] via-[#00FFAF] to-[#008F4C]  bg-clip-text text-transparent">
							mm
						</span>
						in'
					</h1>
				</div>
				<div className=" flex ">
					{navList.map((navItem, index) => (
						<div className="w-[89px] h-[30px] bg-gray rounded-[20px] flex-center" key={index}>
							{navItem}
						</div>
					))}
				</div>
			</nav>
		</header>
	);
};
export default Navbar;
