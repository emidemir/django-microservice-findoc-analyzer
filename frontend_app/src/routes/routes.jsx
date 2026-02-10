import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import HomePage from '../pages/HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      
      {/* 404 Catch-all Route */}
      <Route path="*" element={
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>404</h1>
          <p>Page not found</p>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;