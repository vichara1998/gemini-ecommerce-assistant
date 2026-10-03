"use client";

import Image from "next/image";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Message } from "ai/react";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import shopLogo from "./assets/shop-ai-icon.png";

const uuid = () => self.crypto?.randomUUID?.() ?? Math.random().toString(36).substring(2);

const topics = [
    { title: "Orders & delivery", prompt: "How can I track my order?", icon: "package" },
    { title: "Returns & refunds", prompt: "What is your return policy?", icon: "return" },
    { title: "Products & stock", prompt: "Do you have iPhone 14 in stock?", icon: "bag" },
    { title: "Payments", prompt: "What payment methods do you accept?", icon: "card" },
] as const;

const suggestions = [
    "Find my order",
    "Return or refund",
    "Delivery question",
    "Product question",
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true as const,
    };

    switch (name) {
        case "package":
            return <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.3 7.6 7.7 4.3 7.7-4.3M12 12v9M8 5.3l8 4.5" /></svg>;
        case "return":
            return <svg {...common}><path d="M9 14 4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-2" /></svg>;
        case "bag":
            return <svg {...common}><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>;
        case "card":
            return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></svg>;
        case "arrow":
            return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
        case "plus":
            return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
        case "send":
            return <svg {...common}><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></svg>;
        case "close":
            return <svg {...common}><path d="m18 6-12 12M6 6l12 12" /></svg>;
        default:
            return null;
    }
}

const Home = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const messageListRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const noMessages = messages.length === 0;

    useEffect(() => {
        const list = messageListRef.current;
        if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    }, [messages, isThinking]);

    const sendMessage = async (content: string) => {
        const userMessage: Message = {
            id: uuid(),
            content,
            role: "user",
            createdAt: new Date(),
        };
        const conversation = [...messages, userMessage];
        setMessages(conversation);
        setIsThinking(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: conversation }),
            });

            if (!response.ok) {
                throw new Error(`Chat request failed (${response.status})`);
            }

            const data = await response.json();
            if (typeof data.content !== "string") {
                throw new Error("Chat response did not include a message");
            }

            setMessages((current) => [
                ...current,
                {
                    id: uuid(),
                    content: data.content,
                    role: "assistant",
                    createdAt: new Date(),
                },
            ]);
        } catch (error) {
            console.error("Error sending chat message:", error);
            setMessages((current) => [
                ...current,
                {
                    id: uuid(),
                    content: "I couldn't get a response just now. Please try again in a moment.",
                    role: "assistant",
                    createdAt: new Date(),
                },
            ]);
        } finally {
            setIsThinking(false);
            inputRef.current?.focus();
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const message = input.trim();
        if (!message || isThinking) return;
        setInput("");
        void sendMessage(message);
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    const applyPrompt = (prompt: string) => {
        setInput(prompt);
        inputRef.current?.focus();
    };

    const copyMessage = async (message: Message) => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopiedMessageId(message.id);
            window.setTimeout(() => setCopiedMessageId(null), 1600);
        } catch (error) {
            console.error("Unable to copy assistant response:", error);
        }
    };

    return (
        <main className="site-shell">
            <header className="topbar">
                <Link className="brand" href="/" aria-label="Shop support home">
                    <span className="brand-mark">
                        <Image src={shopLogo} alt="" width={35} height={35} priority />
                    </span>
                    <span className="brand-name">SHOP-AI <span>ASSIST</span></span>
                </Link>
                <a className="topbar-help-link" href="#chat">Need a hand? <span>Start a chat <Icon name="arrow" size={14} /></span></a>
            </header>

            <div className="workspace">
                <aside className="intro-panel">
                    <div className="eyebrow"><span className="eyebrow-line" /> CUSTOMER CARE</div>
                    <h1>Good shopping<br />should come with<br /><em>good support.</em></h1>
                    <p className="intro-copy">Need help with an order, a return, or finding the right product? Start a conversation and ask away.</p>

                    <div className="topics-heading">
                        <span>HOW CAN WE HELP?</span>
                    </div>
                    <div className="topic-list">
                        {topics.map((topic, index) => (
                            <button className="topic-card" key={topic.title} onClick={() => applyPrompt(topic.prompt)}>
                                <span className="topic-icon"><Icon name={topic.icon} size={19} /></span>
                                <span className="topic-title">{topic.title}</span>
                                <span className="topic-index">0{index + 1}</span>
                                <span className="topic-arrow"><Icon name="arrow" size={16} /></span>
                            </button>
                        ))}
                    </div>
                    <div className="support-note">
                        <div className="support-note-icon"><Icon name="package" size={16} /></div>
                        <div><strong>Order help, all in one place</strong><span>Tracking, delivery, returns and more.</span></div>
                    </div>
                </aside>

                <section className="chat-panel" id="chat" aria-label="Chat with customer support">
                    <div className="chat-header">
                        <div className="chat-agent-mark" aria-hidden="true">s</div>
                        <div className="chat-heading">
                            <h2>Shopmate help</h2>
                            <p>Orders, delivery, returns and products</p>
                        </div>
                        {!noMessages && (
                            <button className="new-chat-button" type="button" onClick={() => setMessages([])} title="Start a new conversation">
                                <Icon name="plus" size={16} /><span>New chat</span>
                            </button>
                        )}
                    </div>

                    <div className="chat-messages" ref={messageListRef} aria-live="polite">
                        {noMessages ? (
                            <div className="welcome-state">
                                <div className="welcome-time">CUSTOMER CARE</div>
                                <div className="welcome-message">
                                    <div className="assistant-avatar" aria-hidden="true">s</div>
                                    <div className="welcome-copy">
                                        <span className="message-author">Shopmate</span>
                                        <p>Hi! What can I help you with?</p>
                                    </div>
                                </div>
                                <div className="suggestion-heading">COMMON QUESTIONS</div>
                                <div className="suggestion-grid">
                                    {suggestions.map((suggestion) => (
                                        <button key={suggestion} className="suggestion-card" onClick={() => applyPrompt(suggestion)}>
                                            <span>{suggestion}</span><Icon name="arrow" size={16} />
                                        </button>
                                    ))}
                                </div>
                                <p className="welcome-footnote">Choose a topic above, or write your question below.</p>
                            </div>
                        ) : (
                            <div className="message-stack">
                                {messages.map((message) => (
                                    <Bubble
                                        key={message.id}
                                        message={message}
                                        copied={copiedMessageId === message.id}
                                        onCopy={() => void copyMessage(message)}
                                    />
                                ))}
                                {isThinking && <LoadingBubble />}
                            </div>
                        )}
                    </div>

                    <div className="composer-wrap">
                        {noMessages && (
                            <div className="quick-prompts" aria-label="Popular questions">
                                {["Track an order", "Returns", "Delivery"].map((prompt) => (
                                    <button key={prompt} type="button" onClick={() => applyPrompt(prompt)}>{prompt}</button>
                                ))}
                            </div>
                        )}
                        <form className="composer" onSubmit={handleSubmit}>
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Write your question..."
                                aria-label="Your message"
                                rows={1}
                                maxLength={2000}
                                disabled={isThinking}
                            />
                            <button className="send-button" type="submit" aria-label="Send message" disabled={!input.trim() || isThinking}>
                                <Icon name="send" size={18} />
                            </button>
                        </form>
                        <div className="composer-footer"><span><kbd>Enter</kbd> to send <span className="footer-divider">·</span> <kbd>Shift + Enter</kbd> for a new line</span><span>{input.length}/2000</span></div>
                    </div>
                </section>
            </div>
            <footer className="site-footer"><span>SHOPMATE CUSTOMER CARE</span><span>Need to start over? Use New chat above.</span></footer>
        </main>
    );
};

export default Home;
