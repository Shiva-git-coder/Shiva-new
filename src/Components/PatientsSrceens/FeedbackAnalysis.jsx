import React, { useState, useEffect } from 'react';
import MicIcon from '@mui/icons-material/Mic'; // MUI Mic icon
import MicOffIcon from '@mui/icons-material/MicOff'; // MUI MicOff icon

function FeedbackAnalysis() {
  const questions = [
    "What is your name?",
    "How are you feeling today?",
    "What are your goals for today?",
    "Do you need help with anything specific?",
    "What time will you finish your work today?"
  ];

  const [chatHistory, setChatHistory] = useState([]); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);
  const [isListening, setIsListening] = useState(false); 
  const [speechRecognition, setSpeechRecognition] = useState(null); 
  const [questionsAvailable, setQuestionsAvailable] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const apiResponse = { data: true }; 
        
        if (apiResponse.data) {
          setQuestionsAvailable(true);
          startChat(); 
        } else {
          setQuestionsAvailable(false);
        }
      }, 1000);
    };

    fetchData();

    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserInput(transcript); 
      };
      setSpeechRecognition(recognition);
    }
  }, []);

  const startChat = () => {
    setIsChatActive(true);
    addMessage("AI", questions[0]); 
  };

  const addMessage = (sender, text) => {
    setChatHistory((prev) => [...prev, { sender, text }]);
    localStorage.setItem("chatHistory", JSON.stringify([...chatHistory, { sender, text }]));
  };

  const handleUserResponse = async () => {
    if (!userInput.trim()) return;

    addMessage("User", userInput);

    try {
      const apiResponse = await fetch('https://your-api-endpoint.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }), 
      });
      const data = await apiResponse.json();

      const aiMessage = data.response || "Thank you for the chat!";
      addMessage("AI", aiMessage); 

      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setTimeout(() => addMessage("AI", questions[nextIndex]), 1000);
        setCurrentQuestionIndex(nextIndex);
      } else {
        setTimeout(() => addMessage("AI", "Thank you for the chat! Have a great day!"), 1000);
        setIsChatActive(false);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      addMessage("AI", "Sorry, something went wrong. Please try again later.");
    }

    setUserInput("");
  };

  const handleMicClick = () => {
    if (speechRecognition) {
      if (isListening) {
        speechRecognition.stop(); 
      } else {
        speechRecognition.start(); 
      }
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatWindow}>
        {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: message.sender === "AI" ? "flex-start" : "flex-end",
              backgroundColor: message.sender === "AI" ? "#e0e0e0" : "#cce5ff",
            }}
          >
            <strong>{message.sender}: </strong>{message.text}
          </div>
        ))}
      </div>

      {questionsAvailable && isChatActive && (
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your response..."
            style={styles.input}
          />
          <button onClick={handleUserResponse} style={styles.sendButton}>
            Send
          </button>
          <button
            onClick={handleMicClick}
            style={{
              ...styles.micButton,
              color: isListening ? 'green' : 'gray', // Change color based on the listening state
            }}
          >
            {isListening ? <MicIcon /> : <MicOffIcon />} {/* MUI Mic Icon */}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    margin: '50px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  chatWindow: {
    padding: '10px',
    height: '300px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  message: {
    padding: '10px',
    borderRadius: '5px',
    maxWidth: '70%',
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
  sendButton: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
  },
  micButton: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#fff',
    color: 'gray',
    cursor: 'pointer',
    marginLeft: '10px',
    borderRadius: '8px',
    fontSize: '18px',
  },
};

export default FeedbackAnalysis;
