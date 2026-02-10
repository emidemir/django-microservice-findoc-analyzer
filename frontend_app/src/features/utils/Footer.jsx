// Footer.jsx
import React from 'react';
import '../../style/utils/Footer.css'

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <p>&copy; 2026 FinDoc Analyzer. All rights reserved.</p>
      <div>
        <a href="#privacy" style={{marginRight: '15px'}}>Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
      </div>
    </div>
  </footer>
);
export default Footer;