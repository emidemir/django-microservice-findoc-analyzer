import React from 'react';

const SignupForm = ({ onToggle }) => {
  return (
    <div className="auth-form">
      <h2 style={{ textAlign: 'center' }}>Create Account</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Jane Doe" required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="jane@example.com" required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" required />
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