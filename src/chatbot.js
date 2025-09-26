import React, { useState } from 'react';

const ChatbotWindow = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Button to toggle chatbot */}
      <button 
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 20px',
          borderRadius: '8px',
          background: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {open ? 'Close Chat' : 'Open Chat'}
      </button>

      {/* Chatbot window */}
      {open && (
        <iframe
          src="https://your-chatbot-app.streamlit.app"
          title="Chatbot"
          style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            width: '400px',
            height: '500px',
            border: '2px solid #007bff',
            borderRadius: '10px',
            zIndex: 999,
            background: '#fff'
          }}
        ></iframe>
      )}
    </div>
  );
};

export default ChatbotWindow;
