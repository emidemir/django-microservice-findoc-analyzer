// src/features/home/Analyzer.jsx
import React, { useState, useRef } from 'react';
import '../../style/home/Analyzer.css';
import api from '../../api.js';

const Analyzer = ({ activeChatId, messages, onUpdateMessages }) => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSend = async () => {
    if (!prompt.trim() && files.length === 0) return;

    // 1. Create the new user message
    const newMessageForUI = { role: 'user', text: prompt, attachments: files };
    
    // 2. Update the parent state immediately so UI updates
    const updatedMessages = [...messages, newMessageForUI];
    onUpdateMessages(activeChatId, updatedMessages);
    
    // 3. Prepare FormData
    const formData = new FormData();
    formData.append('text', prompt);
    formData.append('role', 'user');
    files.forEach((file) => {
      formData.append('attachments', file); 
    });

    // Reset inputs
    setPrompt('');
    setFiles([]);

    // 4. Send request
    try {
        const response = await api.post('/worker/upload/', formData);

        if (response.status === 200){
            // Update parent state again with AI response
            onUpdateMessages(activeChatId, [...updatedMessages, { 
              role: 'ai', 
              text: 'I have analyzed the documents...' // Replace with response.data.text later
            }]);
        }
    } catch (error) {
        console.error(error);
        onUpdateMessages(activeChatId, [...updatedMessages, { 
          role: 'ai', 
          text: 'Something went wrong with the request' 
        }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        {messages.map((msg, idx) => (
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