import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/userSlice';
import React, { useEffect } from 'react';
import { fetchRecommendations } from '../features/recommendationsSlice';
import { IoPlay } from "react-icons/io5";

const Home = () => {

  const dispatch = useDispatch();
  const { tracks, status, error } = useSelector((state) => state.recommendations);

  console.log(tracks)

   useEffect(() => {
		dispatch(fetchRecommendations({ genre: ''}));
   }, [dispatch]);

   console.log(tracks)

  return (
		<div className="p-5">
			<div className="w-full bg-gray mt-5 rounded-lg mb-10 h-[350px] grid grid-rows-[270px_80px]">

				<img
					src={tracks[0]?.album.images[1]?.url}
					alt=""
					className="w-full h-full object-fit"
				/>
        <IoPlay className="hover:fill-green"/>
			</div>
			<button onClick={() => dispatch(logout())}>
				Logout
			</button>
		</div>
  );
}
export default Home
