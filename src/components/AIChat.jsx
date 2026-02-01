import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react'

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello Aspirant! I am your AI UPSC Mentor. How can I help you today?' }
    ])
    const [input, setInput] = useState('')

    const handleSend = () => {
        if (!input.trim()) return
        const userMsg = { role: 'user', text: input }
        setMessages([...messages, userMsg])
        setInput('')

        // Simulate AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'bot',
                text: "I've analyzed your query. For UPSC Mains, focus on linking this constitutional provision with recent SC judgements. Would you like a mind map on this?"
            }])
        }, 1000)
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
                                    {m.role === 'bot' && <Bot size={14} className="bot-icon" />}
                                    <p>{m.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="chat-footer">
                            <input
                                type="text"
                                placeholder="Ask about Syllabus, News..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={handleSend}><Send size={18} /></button>
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
