import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import LoginForm from '../features/auth/LoginForm';
import SignupForm from '../features/auth/SignupForm';
import '../style/auth/AuthStyles.css';
import api from '../api'

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  const handleGoogleAuth = async (credentialResponse) => {
    try {
      const response = await api.post('/auth/oauth/',{
        access_token: credentialResponse.credential
      })
      const data = await response.data

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(data.user)); // Stringify objects for localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        navigate('/home');
      } else {
        console.error('Error:', data.error);
        alert('Authentication failed: ' + data.error);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="auth-container">
        <div className="auth-card">
          {isLoginView ? (
            <LoginForm onToggle={() => setIsLoginView(false)} />
          ) : (
            <SignupForm onToggle={() => setIsLoginView(true)} />
          )}

          <div className="social-auth-separator">
            <span>OR</span>
          </div>

          <div className="google-btn-container">
            <GoogleLogin
              onSuccess={handleGoogleAuth}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
              theme="outline"
              width="100%"
            />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthPage;