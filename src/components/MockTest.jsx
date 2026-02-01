import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Timer, Award, RefreshCw, Loader2, AlertCircle } from 'lucide-react'

// REPLACE THIS WITH YOUR n8n WEBHOOK URL
const N8N_MOCK_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/get-upsc-content';

const MockTest = () => {
    const [testStarted, setTestStarted] = useState(false)
    const [currentQ, setCurrentQ] = useState(0)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)
    const [questions, setQuestions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [showExplanation, setShowExplanation] = useState(false)

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!N8N_MOCK_WEBHOOK_URL) {
                setQuestions([
                    {
                        q: 'Who was the first President of India?',
                        options: ['Rajendra Prasad', 'Radhakrishnan', 'Nehru', 'Ambedkar'],
                        correct: 0,
                        explanation: 'Dr. Rajendra Prasad was the first President of India.'
                    }
                ]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const res = await fetch(N8N_MOCK_WEBHOOK_URL);
                if (!res.ok) {
                    setError(`n8n Server Error: ${res.status} (${res.statusText}).`);
                    setIsLoading(false);
                    return;
                }
                const data = await res.json();

                // Data Normalization: Handle raw Google Sheet column names if n8n sends them directly
                const rawItems = Array.isArray(data) ? data : (data.mcqs || []);
                const normalized = rawItems.map(item => {
                    // Try to construct options array if it doesn't exist
                    const options = item.options || [
                        item['Option A'] || item.Option1,
                        item['Option B'] || item.Option2,
                        item['Option C'] || item.Option3,
                        item['Option D'] || item.Option4
                    ].filter(Boolean);

                    // Map 'Correct Answer' or 'CorrectIndex' to 'correct'
                    let correct = item.correct;
                    if (correct === undefined) {
                        const rawCorrect = item['Correct Answer'] || item.CorrectIndex;
                        // Handle 'A', 'B', 'C', 'D' strings or numbers
                        if (rawCorrect === 'A') correct = 0;
                        else if (rawCorrect === 'B') correct = 1;
                        else if (rawCorrect === 'C') correct = 2;
                        else if (rawCorrect === 'D') correct = 3;
                        else correct = parseInt(rawCorrect) || 0;
                    }

                    return {
                        q: item.q || item.Question || 'Untitled Question',
                        options: options.length >= 2 ? options : ['Err: Missing Options'],
                        correct: correct,
                        explanation: item.explanation || item.Explanation || 'No explanation provided.'
                    };
                });

                setQuestions(normalized);
                setIsLoading(false);
            } catch (err) {
                setError('Network Error: Could not reach n8n. Check CORS and ensure the URL is active.');
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const startTest = () => {
        if (questions.length === 0) return;
        setTestStarted(true)
        setCurrentQ(0)
        setScore(0)
        setFinished(false)
        setShowExplanation(false)
    }

    const handleAnswer = (idx) => {
        const currentQData = questions[currentQ];
        if (currentQData && idx === currentQData.correct) setScore(score + 1)
        setShowExplanation(true)
    }

    const nextQuestion = () => {
        setShowExplanation(false)
        if (currentQ + 1 < questions.length) setCurrentQ(currentQ + 1)
        else setFinished(true)
    }

    if (isLoading) return (
        <div className="mocktest-container flex-center" style={{ textAlign: 'center', height: '60vh' }}>
            <Loader2 className="spinner" size={40} style={{ margin: '0 auto 1rem' }} />
            <p>Fetching Test Papers...</p>
        </div>
    );

    if (error) return (
        <div className="mocktest-container flex-center" style={{ textAlign: 'center', height: '60vh' }}>
            <AlertCircle color="#ef4444" size={40} style={{ margin: '0 auto 1rem' }} />
            <p>{error}</p>
        </div>
    );

    // Safety check for questions data
    const currentQuestionData = questions[currentQ];

    return (
        <div className="mocktest-container">
            <div className="section-header"><h2>Mock <span className="accent-text">Test</span></h2></div>
            {!testStarted ? (
                <div className="test-start glass-card">
                    <Award size={60} className="accent-text" />
                    <h3>Ready for GS Practice?</h3>
                    <p>{questions.length} Questions | Synchronized with n8n</p>
                    <button className="btn btn-primary" onClick={startTest}>Start Now</button>
                </div>
            ) : finished ? (
                <div className="test-result glass-card">
                    <h2>Score: {score}/{questions.length}</h2>
                    <button className="btn btn-secondary" onClick={() => { setTestStarted(false); setFinished(false); }}><RefreshCw size={18} /> Retry</button>
                </div>
            ) : currentQuestionData ? (
                <motion.div className="quiz-card glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="quiz-meta"><span>Q {currentQ + 1}/{questions.length}</span></div>
                    <h3>{currentQuestionData.q}</h3>
                    <div className="options-grid">
                        {Array.isArray(currentQuestionData.options) && currentQuestionData.options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`option-btn ${showExplanation ? (idx === currentQuestionData.correct ? 'correct' : 'wrong') : ''}`}
                                onClick={() => !showExplanation && handleAnswer(idx)}
                                disabled={showExplanation}
                            >
                                <span className="opt-label">{String.fromCharCode(65 + idx)}.</span>
                                <span className="opt-text">{opt}</span>
                            </button>
                        ))}
                    </div>
                    {showExplanation && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="explanation-box">
                            <p><strong>Explanation:</strong> {currentQuestionData.explanation}</p>
                            <button className="btn btn-primary" onClick={nextQuestion}>Next Question &rarr;</button>
                        </motion.div>
                    )}
                </motion.div>
            ) : (
                <div className="glass-card flex-center">
                    <p>Error: Question format invalid.</p>
                    <button className="btn btn-secondary" onClick={() => setTestStarted(false)}>Back</button>
                </div>
            )}
        </div>
    )
}

export default MockTest
