import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/userSlice';
import React, { useEffect } from 'react';
import { fetchRecommendations } from '../features/recommendationsSlice';

const Home = () => {

  const dispatch = useDispatch();
  const { tracks, status, error } = useSelector((state) => state.recommendations);

  console.log(tracks)

   useEffect(() => {
		dispatch(fetchRecommendations({ genre: 'pop'}));
   }, [dispatch]);

   console.log(tracks)

  return (
    <div className="p-5">
      <div className="w-full bg-gray mt-5 rounded-lg mb-10">
        <img src={tracks[0]?.album.images[1]?.url} alt="" className="w-full h-full object-fit"/>
      </div>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  )
}
export default Home
