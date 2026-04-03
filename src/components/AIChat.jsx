import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello Aspirant! I am your AI UPSC Mentor. How can I help you today?' }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const AI_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/84fa40cd-7850-40e4-bc05-c2115581c315';

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
            if (!responseText) {
                throw new Error("Empty Response. \n- Check if your 'Respond to Webhook' node is connected and active in the AI system.");
            }

            const data = JSON.parse(responseText);
            const rawData = Array.isArray(data) ? data[0] : data;
            const botText = rawData.output || rawData.message || rawData.text || rawData.response || "Message received, but the AI system didn't return any text in the expected fields.";

            setMessages(prev => [...prev, { role: 'bot', text: botText }]);
        } catch (error) {
            console.error("DEBUG:", error);
            let errorMsg = `Error: ${error.message}`;
            if (error.message.includes('Unexpected end of JSON')) {
                errorMsg = "Empty Response from AI System. \nFIX: In the automation backend, move your 'Respond to Webhook' node to the VERY END of the workflow.";
            }
            setMessages(prev => [...prev, { role: 'bot', text: errorMsg }]);
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="ai-chat-wrapper">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="ai-chat-window glass-card"
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                    >
                        <div className="chat-header">
                            <div className="header-info">
                                <Sparkles size={18} className="accent-text" />
                                <span>AI UPSC Mentor</span>
                            </div>
                            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
                        </div>

                        <div className="chat-body">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`chat-bubble ${m.role}`}>
                                    {m.role === 'bot' ? (
                                        <div className="bot-message-markdown">
                                            <Bot size={14} className="bot-icon" />
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {m.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p>{m.text}</p>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="chat-bubble bot typing">
                                    <Bot size={14} className="bot-icon" />
                                    <p>Thinking...</p>
                                </div>
                            )}
                        </div>

                        <div className="chat-footer">
                            <input
                                type="text"
                                placeholder={isTyping ? "AI is thinking..." : "Ask about Syllabus, News..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isTyping}
                            />
                            <button onClick={handleSend} disabled={isTyping}><Send size={18} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className="ai-trigger-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <MessageSquare />}
                <span className="pulse-ring"></span>
            </motion.button>
        </div>
    )
}

export default AIChat
