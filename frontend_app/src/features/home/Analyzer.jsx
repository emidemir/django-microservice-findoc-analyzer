// Analyzer.jsx
import React, { useState, useRef } from 'react';
import '../../style/home/Analyzer.css';
import api from '../../api.js'

const Analyzer = () => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hello! Upload your financial documents and ask me to analyze trends, risks, or summaries.' }
  ]);
  const fileInputRef = useRef(null);

  const handleSend = async () => {
    if (!prompt.trim() && files.length === 0) return;

    // --- UI UPDATE (Keep this logic) ---
    // React state handles File objects fine for display, so we keep this object for the UI
    const newMessageForUI = { role: 'user', text: prompt, attachments: files };
    setChatHistory([...chatHistory, newMessageForUI]);
    
    // --- BACKEND REQUEST (Changed to FormData) ---
    const formData = new FormData();
    
    // 1. Append text data
    formData.append('text', prompt);
    formData.append('role', 'user');

    // 2. Append files
    // iterate over the files array and append each one to the same key
    files.forEach((file) => {
      formData.append('attachments', file); 
    });

    // Reset inputs
    setPrompt('');
    setFiles([]);

    try {
        // 3. Send formData
        // Note: Do NOT manually set 'Content-Type': 'application/json'
        // Axios/Fetch will automatically set it to 'multipart/form-data' with the correct boundary
        const response = await api.post('/worker/upload/', formData);

        if (response.status === 200){
            // ... success logic
            setChatHistory(prev => [...prev, { 
              role: 'ai', 
              text: 'I have analyzed the documents...' 
            }]);
          }
        } catch (error) {
          console.error(error);
          setChatHistory(prev => [...prev, { 
            role: 'ai', 
            text: 'Something went wrong with the request' 
          }]);
    }
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
                name="fin-documents"
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