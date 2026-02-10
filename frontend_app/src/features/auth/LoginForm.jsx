import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import api from '../../api';

const LoginForm = ({ onToggle }) => {

  const navigate = useNavigate();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const payload = {
        username: username,
        password: password,
      }
      // const response = await fetch('http://auth-app-service:8000',{
      //     method: "POST",
      //     headers: {
      //       "Content-type": "application/json",
      //     },
      //     body: JSON.stringify(payload),
      //   }
      // )
      const response = await api.post('/auth/login/',{
        username,
        password
      })
      const data = await response.data

      localStorage.setItem("userID", data.user.id);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/home")
    }catch(error){
      alert("Signin failed: " + JSON.stringify(error));
    }
  }

  return (
    <div className="auth-form">
      <h2 style={{ textAlign: 'center' }}>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" onChange={(e)=>setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button className="auth-btn">Login</button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        New user? <button className="toggle-link" onClick={onToggle}>Create account</button>
      </p>
    </div>
  );
};

export default LoginForm;