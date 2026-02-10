import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import api from '../../api.js';

const SignupForm = ({ onToggle }) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '', // Changed from email to username
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Register User
      const response = await api.post('/auth/signup/', { 
        email: formData.email, 
        password: formData.password 
      })

      const data = await response.data

      localStorage.setItem("userID", data.user.id);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      navigate('/home')
      
    } catch (error) {
      console.error("Signup failed", error);
      alert('Signup Failed. Username might be taken.');
    }
  };

  return (
    <div className="auth-form">
      <h2 style={{ textAlign: 'center' }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="jane@example.com" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
        </div>
        <button className="auth-btn">Register</button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Already have an account? <button className="toggle-link" onClick={onToggle}>Log in</button>
      </p>
    </div>
  );
};

export default SignupForm;