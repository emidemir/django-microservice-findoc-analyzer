// src/features/home/Sidebar.jsx
import React, { useState } from 'react';
import '../../style/home/Sidebar.css';

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat, onRenameChat }) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const startRename = (e, chat) => {
    e.stopPropagation(); // Prevents triggering onSelectChat
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleRenameSubmit = (e, chatId) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleRenameKeyDown = (e, chatId) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(e, chatId);
    } else if (e.key === 'Escape') {
      setEditingChatId(null);
    }
  };

  return (
    <aside className="sidebar-container">
      <button className="new-chat-btn" onClick={onNewChat}>
        <span style={{ fontSize: '1.2rem' }}>+</span> New Chat
      </button>

      <div className="chat-history-list">
        <p className="sidebar-section-title">Recent</p>
        
        {chats.map(chat => (
          <div 
            key={chat.id} 
            className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            {/* Conditional Rendering: Input field vs Text Title */}
            {editingChatId === chat.id ? (
              <input
                type="text"
                className="rename-input"
                value={editTitle}
                autoFocus
                onClick={(e) => e.stopPropagation()} // Keep click inside input
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                onBlur={(e) => handleRenameSubmit(e, chat.id)}
              />
            ) : (
              <span className="chat-title">💬 {chat.title}</span>
            )}

            {/* Action Buttons (Hidden when editing) */}
            {editingChatId !== chat.id && (
              <div className="chat-actions">
                <button 
                  className="action-btn" 
                  title="Rename"
                  onClick={(e) => startRename(e, chat)}
                >
                  ✏️
                </button>
                <button 
                  className="action-btn" 
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;