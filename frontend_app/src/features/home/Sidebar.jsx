// src/features/home/Sidebar.jsx
import React from 'react';
import '../../style/home/Sidebar.css';

const Sidebar = ({ chats, activeChatId, onSelectChat, onNewChat }) => {
  return (
    <aside className="sidebar-container">
      <button className="new-chat-btn" onClick={onNewChat}>
        <span style={{ fontSize: '1.2rem' }}>+</span> New Chat
      </button>

      <div className="chat-history-list">
        <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
          Recent
        </p>
        {chats.map(chat => (
          <button 
            key={chat.id} 
            className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            💬 {chat.title}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;