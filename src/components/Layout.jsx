import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import React from 'react';


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
