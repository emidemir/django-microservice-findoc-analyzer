// src/pages/HomePage.jsx
import React, { useState } from 'react';
import Navbar from '../features/utils/Navbar';
import Sidebar from '../features/home/Sidebar';
import Analyzer from '../features/home/Analyzer';

const HomePage = () => {
  // Define what an empty chat looks like
  const initialMessage = { role: 'ai', text: 'Hello! Upload your financial documents and ask me to analyze trends, risks, or summaries.' };

  // State to hold ALL chats
  const [chats, setChats] = useState([
    { id: Date.now(), title: 'New Chat', messages: [initialMessage] }
  ]);
  
  // State to track which chat is currently open
  const [activeChatId, setActiveChatId] = useState(chats[0].id);

  // Function to create a new chat
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [initialMessage]
    };
    setChats([newChat, ...chats]); // Add to top of list
    setActiveChatId(newChat.id);   // Switch to it
  };

  // Function to update the messages of the active chat
  const handleUpdateMessages = (chatId, newMessages) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          // Update the title based on the first user message if it's still "New Chat"
          const firstUserMsg = newMessages.find(m => m.role === 'user');
          const newTitle = (chat.title === 'New Chat' && firstUserMsg) 
            ? firstUserMsg.text.substring(0, 20) + '...' 
            : chat.title;
            
          return { ...chat, messages: newMessages, title: newTitle };
        }
        return chat;
      })
    );
  };

  // Find the currently active chat object to pass to the Analyzer
  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff' }}>
      {/* Left Sidebar */}
      <Sidebar 
        chats={chats} 
        activeChatId={activeChatId} 
        onSelectChat={setActiveChatId} 
        onNewChat={handleNewChat} 
      />
      
      {/* Right Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />
        
        <main style={{ flex: 1, overflow: 'hidden' }}>
          <Analyzer 
            activeChatId={activeChatId}
            messages={activeChat.messages}
            onUpdateMessages={handleUpdateMessages}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;