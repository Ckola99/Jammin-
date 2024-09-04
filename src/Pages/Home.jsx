import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';

const Home = () => {
  const dispatch = useDispatch();
  return (
    <div className="p-5">
      <div className="w-full bg-gray mt-5 h-[246px] rounded-lg mb-10">
        
      </div>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  )
}
export default Home
