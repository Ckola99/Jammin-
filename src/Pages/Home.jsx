import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";
import React, { useEffect, useState, useRef } from "react";
import { IoPlay } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { useSwipeable } from "react-swipeable";
import {
	fetchSongRecommendations,
	songsRecommended,
	fetchTopArtists,
	topArtistsSelector,
	fetchNewReleases,
	newReleases
} from "../features/recommendationsSlice";

const Home = () => {
	const dispatch = useDispatch();
	const topArtists = useSelector(topArtistsSelector);
	const myRecommended = useSelector(songsRecommended);
	const newSongs = useSelector(newReleases)

	// State to track the current song index
	const [currentSongIndex, setCurrentSongIndex] = useState(0);

	useEffect(() => {
		dispatch(fetchTopArtists())
		dispatch(fetchSongRecommendations())
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchNewReleases())

	},[dispatch])

	const handleNextSong = () => {
		if (currentSongIndex < myRecommended.length - 1) {
			setCurrentSongIndex((prevIndex) => prevIndex + 1);
		}
	};

	const handlePreviousSong = () => {
		if (currentSongIndex > 0) {
			setCurrentSongIndex((prevIndex) => prevIndex - 1);
		}
	};


	// Swipe handlers
	const swipeHandlers = useSwipeable({
		onSwipedLeft: () => handleNextSong(),
		onSwipedRight: () => handlePreviousSong(),
		preventDefaultTouchmoveEvent: true,
		trackMouse: true, // If you want to support mouse swiping on desktop too
	});

	const currentTrack = myRecommended[currentSongIndex];
	console.log('new:', newSongs)

	return (
		<div className="p-5">
			<h1 className="text-center text-2xl">
				{" "}
				<span className="font-bold">Welcome</span> to
				Jammin your AI enhanced music assistant!
			</h1>
			<div className="mt-10 mb-5 grid grid-cols-2">
				<h2>Song recommendations</h2>
				<button className="justify-self-end">
					Enhance
				</button>
			</div>
			<div
				className="border rounded-lg overflow-hidden w-full  grid grid-rows-[90%_10%] h-[400px]"
				{...swipeHandlers}
			>
				<div
					key={currentSongIndex}
					className="grid justify-items-center"
				>
					<img
						src={
							currentTrack?.album
								.images[1]?.url
						}
						alt={currentTrack?.name}
						className=""
					/>
					<p>{currentTrack?.name}</p>
					<p className="opacity-50 text-[12px]">
						{currentTrack?.artists
							.map(
								(artist) =>
									artist?.name
							)
							.join(", ")}
					</p>
				</div>

				<div className="grid grid-cols-3 justify-items-center border-t">
					<div>
						<IoRemoveCircleOutline
							className="h-full"
							size={28}
						/>
					</div>
					<div>
						<IoPlay
							className="h-full"
							size={28}
						/>
					</div>
					<div>
						<GoHeartFill
							className="h-full"
							size={28}
						/>
					</div>
				</div>
			</div>
			<div>
				{newSongs.items.map(song => (
					<div key={song.id}>
						<img src={song.images[2]} alt=''/>

					</div>
				))}
			</div>
			<button
				onClick={() => dispatch(logout())}
				className="bg-red-500 text-white px-4 py-2 rounded"
			>
				Logout
			</button>
		</div>
	);
};

export default Home;
