import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Only create one connection globally
const socket = io('http://localhost:5000');

const Chat = () => {
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !username.trim()) return;

    const messageData = {
      sender: username,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit('send_message', messageData);
    setMessage('');
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-orange-400 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">💬 Real-Time Chat</h2>

      {!isUsernameSet ? (
        <form onSubmit={handleUsernameSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Join Chat
          </button>
        </form>
      ) : (
        <>
          <div className="mb-3 text-lg">
            Welcome, <strong>{username}</strong>!
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded"
            />
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Send
            </button>
          </form>

          <div className="h-72 overflow-y-auto bg-gray-100 p-3 rounded space-y-2">
            {chat.map((msg, idx) => (
              <div key={idx} className="bg-white p-3 rounded shadow-sm">
                <p>
                  <strong>{msg.sender}</strong>: {msg.message}
                </p>
                <div className="text-xs text-gray-500">{msg.timestamp}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
