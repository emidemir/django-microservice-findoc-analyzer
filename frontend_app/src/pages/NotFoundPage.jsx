import React from 'react';
import '../style/not-found/NotFoundPage.css'

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Oops! Page not found</h2>
        <p>
          The page you are looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>
        
        <a href="/" className="home-link">
          Back to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFound;