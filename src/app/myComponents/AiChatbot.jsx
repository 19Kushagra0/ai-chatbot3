"use client";

import React, { useState, useRef, useEffect } from "react";
import "@/app/myComponents/AiChatbot.css";

export default function AiChatbot() {
  const [userData, setUserData] = useState([]);
  const [aiData, setAiData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  // ⭐ NEW: Load messages from database on page load
  useEffect(() => {
    const loadMessages = async () => {
      const res = await fetch("/api/chat"); // GET request
      const data = await res.json();

      // separate user and ai messages
      const users = data.messages
        .filter((m) => m.role === "user")
        .map((m) => m.text);

      const ai = data.messages
        .filter((m) => m.role === "ai")
        .map((m) => m.text);

      setUserData(users);
      setAiData(ai);
    };

    loadMessages();
  }, []); // runs only once

  const submitButton = async () => {
    console.log(inputValue);

    // save user message instantly in UI
    const copyUserData = [...userData];
    copyUserData.push(inputValue);
    setUserData(copyUserData);

    const currentMsg = inputValue;
    setInputValue("");

    const showTyping = [...aiData];
    showTyping.push("typing...");
    setAiData(showTyping);

    // send to backend
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: currentMsg }),
    });

    const data = await response.json();
    const aiReply = data.reply;

    // show AI reply
    const copyAiData = [...aiData];
    copyAiData.push(aiReply);
    setAiData(copyAiData);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [userData, aiData]);

  return (
    <div className="aiChatbot-full-container">
      {/* Header */}
      <div className="aiChatbot-header">
        <div className="header-left">
          <span className="header-title">Chat bot</span>
        </div>
      </div>

      {/* Messages */}
      <div className="aiChatbot-messages">
        {userData.map((el, index) => {
          return (
            <div key={index} className="aiChatbot-messages-box">
              <div className="message-row user-row">
                <div className="message-bubble user-msg">{el}</div>
              </div>
              <div className="message-row ai-row">
                <div className="message-bubble ai-msg">{aiData[index]}</div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="aiChatbot-input-area">
        <textarea
          value={inputValue}
          onChange={inputHandler}
          placeholder="Ask me"
          className="chat-input"
          rows="1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitButton();
            }
          }}
        ></textarea>
        <button onClick={submitButton} className="send-btn">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}
