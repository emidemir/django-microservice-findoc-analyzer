// Analyzer.jsx
import React, { useState, useRef } from 'react';
import '../../style/home/Analyzer.css';

const Analyzer = () => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hello! Upload your financial documents and ask me to analyze trends, risks, or summaries.' }
  ]);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!prompt.trim() && files.length === 0) return;

    // Add user message to UI
    const newMessage = { role: 'user', text: prompt, attachments: files };
    setChatHistory([...chatHistory, newMessage]);
    
    // Reset inputs
    setPrompt('');
    setFiles([]);

    // Simulate AI Response (In reality, call your backend here)
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: 'I have analyzed the documents. I see a 12% increase in operational costs compared to Q3...' 
      }]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="avatar">{msg.role === 'ai' ? 'AI' : 'U'}</div>
            <div className="message-content">
              {msg.text}
              {msg.attachments?.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  {msg.attachments.map((f, i) => (
                    <span key={i} className="file-pill">📄 {f.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="input-wrapper">
        <div className="input-container">
          <textarea 
            className="chat-input"
            placeholder="Ask FinDoc anything..."
            rows="1"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <div className="input-actions">
            <div className="file-upload-section">
              <button 
                onClick={() => fileInputRef.current.click()}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                📎
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                multiple 
                hidden 
                onChange={(e) => setFiles(Array.from(e.target.files))}
              />
              {files.length > 0 && <span className="file-pill">{files.length} files</span>}
            </div>

            <button className="send-btn" onClick={handleSend}>
              ▲
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;