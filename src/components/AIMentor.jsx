import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Bot, Sparkles, User, BrainCircuit, ShieldCheck, Zap } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const AIMentor = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Namaste Aspirant! I am your advanced AI UPSC Mentor. I can help with syllabus strategy, current affairs analysis, and explaining complex GS topics. What is on your mind today?' }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const chatEndRef = useRef(null)

    const AI_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/84fa40cd-7850-40e4-bc05-c2115581c315';

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSend = async () => {
        const messageText = input.trim();
        if (!messageText || isTyping) return

        const userMsg = { role: 'user', text: messageText }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        try {
            const response = await fetch(AI_WEBHOOK_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    chatInput: messageText,
                    message: { text: messageText },
                    text: messageText,
                    query: messageText,
                    messageText: messageText
                })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const responseText = await response.text();
            if (!responseText) throw new Error("Empty Response from AI system.");

            const data = JSON.parse(responseText);
            const rawData = Array.isArray(data) ? data[0] : data;
            const botText = rawData.output || rawData.message || rawData.text || rawData.response || "I processed your request but need further details to provide a better answer.";

            setMessages(prev => [...prev, { role: 'bot', text: botText }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "Connectivity issue. Please ensure the backend server is active." }]);
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="ai-mentor-container">
            <div className="section-header">
                <h2>AI <span className="accent-text">Mentor</span></h2>
                <p>Your 24/7 dedicated companion for UPSC Strategy and Support.</p>
            </div>

            <div className="mentor-layout">
                <div className="mentor-features-sidebar">
                    <div className="feature-item glass-card">
                        <BrainCircuit className="accent-text" />
                        <div>
                            <h4>Syllabus Helper</h4>
                            <p>Deep dives into any GS topic.</p>
                        </div>
                    </div>
                    <div className="feature-item glass-card">
                        <Zap className="accent-text" />
                        <div>
                            <h4>News Analysis</h4>
                            <p>Simplified Current Affairs.</p>
                        </div>
                    </div>
                    <div className="feature-item glass-card">
                        <ShieldCheck className="accent-text" />
                        <div>
                            <h4>Strategy Guide</h4>
                            <p>Personalized study plans.</p>
                        </div>
                    </div>
                </div>

                <div className="mentor-chat-area glass-card">
                    <div className="chat-window-full">
                        <div className="chat-header-main">
                            <Sparkles size={20} className="accent-text" />
                            <span>Mentor Chat v2.0</span>
                        </div>
                        <div className="chat-messages-full">
                            {messages.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`chat-row ${m.role}`}
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <div className="avatar-circle">
                                        {m.role === 'bot' ? <Bot size={18} /> : <User size={18} />}
                                    </div>
                                    <div className="message-content">
                                        {m.role === 'bot' ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {m.text}
                                            </ReactMarkdown>
                                        ) : (
                                            <p>{m.text}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="chat-row bot typing">
                                    <div className="avatar-circle"><Bot size={18} /></div>
                                    <div className="message-content"><p>Analyzing requirements...</p></div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="chat-input-full">
                            <input
                                type="text"
                                placeholder="Type your doubt here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isTyping}
                            />
                            <button onClick={handleSend} disabled={isTyping}>
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIMentor
