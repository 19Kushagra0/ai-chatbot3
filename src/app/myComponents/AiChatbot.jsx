"use client";
// import React, { useState } from "react";
import React, { useState, useRef, useEffect } from "react";
import "@/app/myComponents/AiChatbot.css";
export default function AiChatbot() {
  const [userData, setUserData] = useState([]);
  const [aiData, setAiData] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const inputHandler = (e) => {
    setInputValue(e.target.value);
  };

  const submitButton = async () => {
    console.log(inputValue);

    // save user message
    const copyUserData = [...userData];
    copyUserData.push(inputValue);
    setUserData(copyUserData);

    // save input FIRST before clearing it
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

    // read AI reply
    const data = await response.json();
    const aiReply = data.reply;

    // save ai message
    const copyAiData = [...aiData];
    copyAiData.push(aiReply);
    setAiData(copyAiData);
  };

  const messagesEndRef = useRef(null);

  // step 6(extra) part 2
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // step 6(extra) part 3
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
      {/* Messages Area */}
      <div className="aiChatbot-messages">
        {userData.map((el, index, arr) => {
          return (
            <div key={index} className="aiChatbot-messages-box">
              <div className="message-row user-row">
                <div className="message-bubble user-msg">{el}</div>
              </div>
              <div className="message-row ai-row">
                {/* step 5 */}
                <div className="message-bubble ai-msg">{aiData[index]}</div>
              </div>
            </div>
          );
        })}

        {/* // step 6(extra) part 4 */}
        <div ref={messagesEndRef} className=""></div>
      </div>
      {/* Input Area */}
      <div className="aiChatbot-input-area">
        {/* Textarea instead of Input */}
        <textarea
          value={inputValue}
          onChange={inputHandler}
          placeholder="Ask me"
          className="chat-input"
          rows="1"
          onKeyDown={(e) => {
            // step 8(extra)
            if (e.key === "Enter") {
              e.preventDefault();
              submitButton();
            }
          }}
          // if enter key is pressed take input
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
