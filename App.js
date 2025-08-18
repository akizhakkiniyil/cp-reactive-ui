import React, { useState } from 'react';
import './App.css';

function App() {
  // State hooks to manage the component's data
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    if (!message.trim()) return; // Don't send empty messages

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      // Make the POST request to your Spring Boot backend
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });

      if (!apiResponse.ok) {
        // Handle HTTP errors like 500 Internal Server Error
        throw new Error(`HTTP error! Status: ${apiResponse.status}`);
      }

      // The response from your backend is plain text
      const aiTextResponse = await apiResponse.text();
      setResponse(aiTextResponse);

    } catch (e) {
      console.error("Failed to fetch AI response:", e);
      setError("Failed to get a response from the server. Please try again.");
    } finally {
      setIsLoading(false); // Always stop loading, even if there's an error
    }
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>Reactive AI Chat Client</h1>
          <p>Enter a message below to chat with the AI.</p>
        </header>
        <main className="chat-container">
          <form onSubmit={handleSubmit} className="chat-form">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="chat-input"
                disabled={isLoading}
            />
            <button type="submit" className="chat-button" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>

          {/* Display area for the AI's response, loading state, or errors */}
          <div className="response-area">
            {isLoading && <div className="loading-spinner"></div>}
            {error && <div className="error-message">{error}</div>}
            {response && (
                <div className="response-content">
                  <h2>AI Response:</h2>
                  <p>{response}</p>
                </div>
            )}
          </div>
        </main>
      </div>
  );
}

export default App;