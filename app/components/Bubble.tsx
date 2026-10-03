"use client";

import { useState } from "react";
import type { Message } from "ai/react";
import ReactMarkdown from "react-markdown";

interface BubbleProps {
  message: Message;
  copied: boolean;
  onCopy: () => void;
}

const Bubble = ({ message, copied, onCopy }: BubbleProps) => {
  const isAssistant = message.role === "assistant";
  const [timeLabel] = useState(() => {
    const date = message.createdAt ? new Date(message.createdAt) : new Date();
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  });

  return (
    <article className={`message-row ${isAssistant ? "assistant" : "user"}`}>
      {isAssistant && <div className="assistant-avatar" aria-hidden="true">s</div>}
      <div className="message-content">
        <div className="message-meta">
          <strong>{isAssistant ? "Shopmate" : "You"}</strong>
          <time>{timeLabel}</time>
        </div>
        <div className="message-bubble">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {isAssistant && (
          <button className="copy-button" type="button" onClick={onCopy} aria-label="Copy assistant response">
            {copied ? "Copied" : "Copy response"}
          </button>
        )}
      </div>
    </article>
  );
};

export default Bubble;
