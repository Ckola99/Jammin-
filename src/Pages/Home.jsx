import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';

const Home = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  )
}
export default Home
