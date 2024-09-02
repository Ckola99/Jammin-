import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <div>
	<Navbar role='navigation'/>
	<main>
		<Outlet />
	</main>
    </div>
  )
}
export default Layout
