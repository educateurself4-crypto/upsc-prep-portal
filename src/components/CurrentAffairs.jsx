import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, CheckCircle, HelpCircle, Loader2, AlertCircle } from 'lucide-react'

// REPLACE THIS WITH YOUR n8n WEBHOOK URL
const N8N_CA_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/get-upsc-content';

const CurrentAffairs = () => {
    const [activeTab, setActiveTab] = useState('notes')
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [notes, setNotes] = useState([])
    const [mcqs, setMcqs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!N8N_CA_WEBHOOK_URL) {
                // Demo fallback data
                setTimeout(() => {
                    setNotes([
                        { title: 'SC on Right to Privacy', category: 'Polity', summary: 'Recent judgement details.', date: 'Jan 30, 2026' },
                        { title: 'New Economic Policy', category: 'Economy', summary: 'Budget 2026 highlights.', date: 'Jan 30, 2026' }
                    ]);
                    setMcqs([
                        { id: 1, question: 'Which Article deals with Right to Equality?', options: ['Art 14', 'Art 19', 'Art 21', 'Art 32'], correct: 0 }
                    ]);
                    setIsLoading(false);
                }, 500);
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(N8N_CA_WEBHOOK_URL);
                if (!response.ok) {
                    setError(`n8n Server Error: ${response.status} (${response.statusText}). Confirm you are using the Production URL (not the /webhook-test/ URL).`);
                    setIsLoading(false);
                    return;
                }
                const data = await response.json();
                setNotes(data.notes || []);
                setMcqs(data.mcqs || []);
                setIsLoading(false);
            } catch (err) {
                console.error("n8n Fetch Error:", err);
                setError('Network Error: Could not connect to n8n. Check your CORS headers in n8n or ensure you are not using a Test URL while n8n is closed.');
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAnswer = (qId, optionIdx) => {
        setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx })
    }

    return (
        <div className="ca-container">
            <div className="section-header">
                <h2>Daily <span className="accent-text">Current Affairs</span></h2>
                <div className="ca-controls">
                    <div className="tabs">
                        <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>Daily Notes</button>
                        <button className={`tab-btn ${activeTab === 'mcqs' ? 'active' : ''}`} onClick={() => setActiveTab('mcqs')}>Daily MCQs</button>
                    </div>
                    <div className="archive-filter glass-card">
                        <Calendar size={14} />
                        <select className="archive-select">
                            <option>Jan 2026</option>
                            <option>Dec 2025</option>
                            <option>Nov 2025</option>
                        </select>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'notes' ? (
                    <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ca-content">
                        {isLoading ? (
                            <div className="loading-state"><Loader2 className="spinner" /><p>Fetching from n8n...</p></div>
                        ) : error ? (
                            <div className="error-state"><AlertCircle color="#ef4444" /><p>{error}</p></div>
                        ) : (
                            notes.map((note, idx) => (
                                <div key={idx} className="ca-item glass-card">
                                    <div className="item-meta">
                                        <span className="badge">{note.category}</span>
                                        <span className="date"><Calendar size={12} /> {note.date}</span>
                                    </div>
                                    <h3>{note.title}</h3>
                                    <p>{note.summary}</p>
                                </div>
                            ))
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="mcqs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="ca-content">
                        {isLoading ? <div className="loading-state"><Loader2 className="spinner" /></div> :
                            mcqs.map((q) => (
                                <div key={q.id} className="quiz-card glass-card">
                                    <div className="quiz-header"><HelpCircle className="accent-text" /><h4>Question {q.id}</h4></div>
                                    <p>{q.question}</p>
                                    <div className="options-grid">
                                        {q.options.map((opt, idx) => (
                                            <button key={idx} className={`option-btn ${selectedAnswers[q.id] === idx ? (idx === q.correct ? 'correct' : 'wrong') : ''}`} onClick={() => handleAnswer(q.id, idx)}>
                                                {opt}
                                                {selectedAnswers[q.id] === idx && idx === q.correct && <CheckCircle size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CurrentAffairs
