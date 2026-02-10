import React from 'react';
import Navbar from '../features/utils/Navbar'
import Analyzer from '../features/home/Analyzer';
import Footer from '../features/utils/Footer';

const HomePage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        
        <main style={{ flex: 1, backgroundColor: '#ffffff', overflow: 'hidden' }}>
          <Analyzer />
        </main>
  
        {/* Footer is optional for a chat-style UI; often removed or made minimal */}
        <Footer />
      </div>
    );
  };
  
  export default HomePage;