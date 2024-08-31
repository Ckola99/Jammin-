import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login'
import { useSelector } from 'react-redux';
import { isAuthenticated } from '../features/userSlice'


function App() {

  const grantedAccess = useSelector(isAuthenticated);

  return (
    <Router>
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={ grantedAccess ? <Home /> : <Navigate to="/login" />} />

      </Routes>
    </Router>
  )
}

export default App
