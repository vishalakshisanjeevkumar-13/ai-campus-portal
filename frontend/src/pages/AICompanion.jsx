import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icons";

export const AICompanion = () => {
  const { student, getAiResponse, skills } = useApp();
  const [messages, setMessages] = useState([
    {
      id: "m-1",
      sender: "bot",
      text: `Hello ${student.name.split(" ")[0]}! I'm your AI Campus Companion. I continuously analyze your academic transcripts, skill gap matrices, and assessment metrics to guide your daily preparation for ${student.targetRole}. How can I assist you today?`,
      time: "Just now"
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "What should I study today?",
    "Why is my readiness low?",
    "Which skill should I learn first?",
    "How did my DSA improve?",
    "What am I missing for my target role?",
    "Create a 7-day study plan."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend = null) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // Add user message
    const userMsg = {
      id: "user-" + Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const replyText = getAiResponse(query);
      const botMsg = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="chat-container-card">
        {/* Header Bar */}
        <div className="chat-header-bar">
          <div className="chat-bot-info">
            <div className="chat-bot-avatar">🧠</div>
            <div>
              <h2 className="text-base font-bold text-primary">AI Campus Companion</h2>
              <p className="text-xs text-secondary">Your personalized academic and career advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)" }} />
            <span className="text-xs text-muted font-mono">LIVE INTELLIGENCE</span>
          </div>
        </div>

        {/* Scrollable Messages Area */}
        <div className="chat-messages-scroll-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
              <div className={`chat-avatar-mini ${msg.sender}`}>
                {msg.sender === "bot" ? "🧠" : "👤"}
              </div>
              <div>
                <div className={`chat-bubble ${msg.sender}`}>
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted mt-1 px-1">{msg.time}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message-row bot animate-fade-in">
              <div className="chat-avatar-mini bot">🧠</div>
              <div className="chat-bubble bot text-muted text-xs flex items-center gap-2">
                <span className="animate-spin">⚡</span> AI Companion is synthesizing your profile data...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Tray */}
        <div className="suggested-prompts-tray">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              className="prompt-chip-btn"
              onClick={() => handleSendMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Field Area */}
        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input-field"
            placeholder="Ask anything about your skill gaps, coursework, or study strategy..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="chat-send-btn"
            onClick={() => handleSendMessage()}
            aria-label="Send message"
          >
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
