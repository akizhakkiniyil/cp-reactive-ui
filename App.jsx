import React, { useState, useEffect, useRef } from 'react';
import './ChatApp.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call REST service for bot response
  const callChatService = async (userMessage) => {
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Since the service returns a String, we can read it as text
      const botResponse = await response.text();

      // Add bot response to messages
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);

      setIsConnected(true);

    } catch (error) {
      console.error('Error calling chat service:', error);
      setIsConnected(false);

      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Sorry, I'm having trouble connecting to the service. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (inputValue.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const messageToSend = inputValue;
    setInputValue('');

    // Call the REST service
    await callChatService(messageToSend);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-info">
            <div className="bot-avatar">
              <span className="bot-icon">🤖</span>
            </div>
            <div className="header-text">
              <h3>AI Assistant</h3>
              <span className={`status ${isConnected ? 'online' : 'offline'}`}>
              {isConnected ? 'Online' : 'Offline'}
            </span>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
              <div
                  key={message.id}
                  className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? (
                      <span className="user-icon">👤</span>
                  ) : (
                      <span className="bot-icon">{message.isError ? '⚠️' : '🤖'}</span>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <p>{message.text}</p>
                  </div>
                  <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
                </div>
              </div>
          ))}

          {isTyping && (
              <div className="message bot-message typing-indicator">
                <div className="message-avatar">
                  <span className="bot-icon">🤖</span>
                </div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isConnected ? "Type your message..." : "Service unavailable..."}
                className="chat-input"
                disabled={isTyping || !isConnected}
            />
            <button
                type="submit"
                className="send-button"
                disabled={!inputValue.trim() || isTyping || !isConnected}
            >
              <span className="send-icon">📤</span>
            </button>
          </div>
        </form>
      </div>
  );
};

export default ChatApp;
