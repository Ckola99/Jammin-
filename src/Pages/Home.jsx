import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";
import React, { useEffect, useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { IoPlay, IoPause } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { IoRemoveCircleOutline } from "react-icons/io5";
import {
	fetchSongRecommendations,
	songsRecommended,
	fetchTopArtists,
	topArtistsSelector,
	fetchNewReleases,
	newReleases,
} from "../features/recommendationsSlice";
import { playTrack, pauseTrack, stopTrack } from "../features/playbackSlice";
import { user } from "../features/userSlice";

const Home = () => {
	const dispatch = useDispatch();
	const topArtists = useSelector(topArtistsSelector);
	const myRecommended = useSelector(songsRecommended);
	const newSongs = useSelector(newReleases);
	const playbackState = useSelector((state) => state.playback);
	const profile = useSelector(user);

	// State to track the current song index
	const [currentSongIndex, setCurrentSongIndex] = useState(0);

	// useEffect(() => {
	// 	dispatch(fetchTopArtists());
	// }, [dispatch]);

	// useEffect(() => {
	// 	if (topArtists.length > 0) {
	// 		dispatch(fetchSongRecommendations());
	// 	}
	// }, [dispatch, topArtists]);

	useEffect(() => {
		dispatch(fetchNewReleases());
	}, [dispatch]);

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

	const handlePlayPause = () => {
		if (
			playbackState.isPlaying &&
			playbackState.currentTrack === currentTrack?.preview_url
		) {
			dispatch(pauseTrack());
		} else {
			dispatch(playTrack(currentTrack?.preview_url));
		}
	};

	useEffect(() => {
		const audio = new Audio(playbackState.currentTrack);

		if (playbackState.isPlaying) {
			audio.play();
		} else {
			audio.pause();
		}

		return () => {
			audio.pause();
			audio.currentTime = 0;
		};
	}, [playbackState.isPlaying, playbackState.currentTrack]);

	// Handle track change (swipe to next song)
	useEffect(() => {
		if (playbackState.isPlaying) {
			dispatch(pauseTrack()); // Pause the current track
		}
	}, [currentTrack?.preview_url]);

	console.log("new:", newSongs);
	console.log(myRecommended);

	return (
		<div className="p-5 grid gap-10">
			<h1 className="text-center text-xl">
				{" "}
				<span className="font-bold">Welcome</span>{" "}
				{profile?.display_name} to Jammin your AI
				enhanced music assistant!
			</h1>
			<div className=" grid grid-cols-2">
				<h2>Song recommendations</h2>
				<button className="justify-self-end border rounded-lg p-1">
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
					<button>
						<IoRemoveCircleOutline
							className="h-full"
							size={28}
						/>
					</button>
					<button onClick={handlePlayPause}>
						{playbackState.isPlaying &&
						playbackState.currentTrack ===
							currentTrack?.preview_url ? (
							<IoPause
								className="h-full"
								size={28}
							/>
						) : (
							<IoPlay
								className="h-full"
								size={28}
							/>
						)}
					</button>
					<button>
						<GoHeartFill
							className="h-full"
							size={28}
						/>
					</button>
				</div>
			</div>
			<div className="grid gap-2">
				<h2 className="">New Releases:</h2>
				{newSongs?.albums?.items.map((song) => (
					<div
						key={song.id}
						className="border rounded-lg overflow-hidden grid grid-cols-[20%_80%] gap-2"
					>
						<img
							src={song.images[1].url}
							alt={song.name}
						/>
						<div className="grid content-center">
							<p>
								{song.artists
									.map(
										(
											artist
										) =>
											artist.name
									)
									.join(
										", "
									)}
							</p>
							<p className="opacity-50 text-[12px]">
								{song.name} -{" "}
								{song.type}
							</p>
						</div>
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
