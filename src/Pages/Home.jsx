import { authStatus } from '../features/userSlice'


const Home = () => {


  if (authStatus === 'loading') {
    return <div>looaaaadddiiing...
    </div>
  }

  return (
    <div>Home</div>
  )
}
export default Home
