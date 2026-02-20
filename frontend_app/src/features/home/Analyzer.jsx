// src/features/home/Analyzer.jsx
import React, { useState, useRef } from 'react';
import '../../style/home/Analyzer.css';
import api from '../../api.js';

const Analyzer = ({ activeChatId, messages, onUpdateMessages }) => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Find the index of the last user message
  const lastUserIndex = messages.map(m => m.role).lastIndexOf('user');

  const sendToBackend = async (formData, updatedMessages) => {
    try {
      const response = await api.post('/worker/upload/', formData);
      if (response.status === 200) {
        onUpdateMessages(activeChatId, [...updatedMessages, { 
          role: 'ai', 
          text: 'I have analyzed the updated documents...' // Replace with actual response
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

  const handleSend = () => {
    if (!prompt.trim() && files.length === 0) return;

    const newMessageForUI = { role: 'user', text: prompt, attachments: files };
    const updatedMessages = [...messages, newMessageForUI];
    onUpdateMessages(activeChatId, updatedMessages);
    
    const formData = new FormData();
    formData.append('text', prompt);
    formData.append('role', 'user');
    files.forEach((file) => formData.append('attachments', file)); 

    setPrompt('');
    setFiles([]);

    sendToBackend(formData, updatedMessages);
  };

  const handleStartEdit = (index, currentText) => {
    setEditingIndex(index);
    setEditValue(currentText);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const handleResubmitEdit = (index) => {
    if (!editValue.trim()) return;

    // Slice off everything after the edited message (removes the AI's old response)
    const historyUpToEdit = messages.slice(0, index);
    
    const originalMessage = messages[index];
    const editedMessage = { ...originalMessage, text: editValue };
    
    const updatedMessages = [...historyUpToEdit, editedMessage];
    onUpdateMessages(activeChatId, updatedMessages);

    setEditingIndex(null);
    setEditValue('');

    const formData = new FormData();
    formData.append('text', editValue);
    formData.append('role', 'user');
    if (editedMessage.attachments) {
      editedMessage.attachments.forEach((file) => formData.append('attachments', file));
    }

    sendToBackend(formData, updatedMessages);
  };

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="avatar">{msg.role === 'ai' ? 'AI' : 'U'}</div>
            
            <div className="message-content">
              {editingIndex === idx ? (
                <div className="edit-box">
                  <textarea 
                    className="edit-textarea"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                    <button className="btn-save" onClick={() => handleResubmitEdit(idx)}>Save & Submit</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="message-text">
                    {msg.text}
                    {/* ONLY show the edit button if it's the very last user message */}
                    {msg.role === 'user' && idx === lastUserIndex && (
                      <button 
                        className="btn-edit-icon" 
                        onClick={() => handleStartEdit(idx, msg.text)}
                        title="Edit prompt"
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                  
                  {msg.attachments?.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      {msg.attachments.map((f, i) => (
                        <span key={i} className="file-pill">📄 {f.name}</span>
                      ))}
                    </div>
                  )}
                </>
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

            <button className="send-btn" onClick={handleSend}>▲</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;