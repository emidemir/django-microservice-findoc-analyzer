import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router
import '../../style/utils/Navbar.css';
import api from '../../api'

const Navbar = () => {
  const navigate = useNavigate();

  // 1. Define your new functions here
  const handleLogout = async () => {
    const response = await api.post('/auth/logout/');
    if (response.status === 200){
      localStorage.clear();
      alert('Succesfully logged out!');
      navigate('/auth'); // Redirect to login page
    }else{
      alert("Something went wrong!");
    }
  };

  // 2. Use a 'return' statement for the JSX
  return (
    <nav className="navbar">
      <a href="/home" className="nav-logo">
        FinDoc AI
      </a>
      
      <div className="nav-links">
        <a href="/dashboard">History</a>
        <a href="/pricing">Pricing</a>
        
        {/* 3. Attach the function to the onClick event */}
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;