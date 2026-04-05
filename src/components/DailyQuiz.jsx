import Papa from 'papaparse'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Timer, Award, RefreshCw, Loader2, AlertCircle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchWithCache } from '../utils/cacheManager'

// --- CONTENT SOURCES ---
const GSHEET_QUIZ_CSV_URL = ''; // Add your "Published as CSV" Google Sheet URL here
const MONGODB_BACKEND_URL = '/api/daily-quiz';
const STATIC_ARCHIVE_URL = import.meta.env.BASE_URL + 'data/upsc_content.json';

const DailyQuiz = () => {
    const [activeSubTab, setActiveSubTab] = useState('ca')
    const [testStarted, setTestStarted] = useState(false)
    const [selectedQuiz, setSelectedQuiz] = useState(null)
    const [currentQ, setCurrentQ] = useState(0)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)
    const [caQuizzes, setCaQuizzes] = useState([])
    const [staticQuizzes, setStaticQuizzes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showExplanation, setShowExplanation] = useState(false)

    const normalizeQuestion = (item) => {
        const options = item.options || [
            item['Option A'] || item.Option1 || item.option1,
            item['Option B'] || item.Option2 || item.option2,
            item['Option C'] || item.Option3 || item.option3,
            item['Option D'] || item.Option4 || item.option4
        ].filter(Boolean);

        let correct = item.correct;
        if (correct === undefined) {
            const rawCorrect = item['Correct Answer'] || item.CorrectIndex || item.answer;
            if (rawCorrect === 'A' || rawCorrect === 1) correct = 0;
            else if (rawCorrect === 'B' || rawCorrect === 2) correct = 1;
            else if (rawCorrect === 'C' || rawCorrect === 3) correct = 2;
            else if (rawCorrect === 'D' || rawCorrect === 4) correct = 3;
            else correct = parseInt(rawCorrect) || 0;
        }

        const optionsHindi = [
            item['H option A'] || item['H Option A'] || item.hOption1 || '',
            item['H option B'] || item['H Option B'] || item.hOption2 || '',
            item['H option C'] || item['H Option C'] || item.hOption3 || '',
            item['H option D'] || item['H Option D'] || item.hOption4 || ''
        ];

        return {
            q: item.q || item.Question || item.question || 'Untitled Question',
            qHindi: item.Hindi || item.hindi || '',
            options: options.length >= 2 ? options : ['Err: Missing Options'],
            optionsHindi: optionsHindi.some(Boolean) ? optionsHindi : [],
            correct: correct,
            explanation: item.explanation || item.Explanation || 'No explanation provided.'
        };
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const formatQuiz = (q) => ({
                    ...q,
                    date: q.date || new Date().toISOString().split('T')[0],
                    questions: (q.questions || []).map(normalizeQuestion)
                });

                let combinedCA = [];
                let combinedStatic = [];

                // 1. Try Google Sheets (If URL provided)
                if (GSHEET_QUIZ_CSV_URL) {
                    try {
                        const response = await fetch(GSHEET_QUIZ_CSV_URL);
                        const csvText = await response.text();
                        const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });

                        // Group rows by Quiz Title
                        const quizGroups = {};
                        results.data.forEach(row => {
                            const title = row['Quiz Title'] || row.Title || 'Daily Practice Quiz';
                            if (!quizGroups[title]) {
                                quizGroups[title] = {
                                    title: title,
                                    date: row.Date || new Date().toISOString().split('T')[0],
                                    category: row.Category || 'General',
                                    type: (row.Type || 'daily').toLowerCase(),
                                    questions: []
                                };
                            }
                            quizGroups[title].questions.push(normalizeQuestion(row));
                        });

                        const sheetQuizzes = Object.values(quizGroups);
                        combinedCA = sheetQuizzes.filter(q => q.type === 'daily');
                        combinedStatic = sheetQuizzes.filter(q => q.type === 'static');
                    } catch (e) {
                        console.error("GSheet Quiz Fetch Error:", e);
                    }
                }

                // 2. Fetch from Vercel/MongoDB Backend
                if (combinedCA.length === 0 && combinedStatic.length === 0) {
                    const data = await fetchWithCache('backend_daily_quiz_v2', MONGODB_BACKEND_URL);
                    if (data) {
                        let rawCA = data.ca_quizzes || [];
                        if (rawCA.length > 0 && !rawCA[0].questions) {
                            const groupedByDate = {};
                            rawCA.forEach(q => {
                                const qDate = (q.Date || q.date || new Date().toISOString()).split('T')[0];
                                if (!groupedByDate[qDate]) groupedByDate[qDate] = [];
                                groupedByDate[qDate].push(q);
                            });
                            rawCA = Object.keys(groupedByDate).sort((a,b) => b.localeCompare(a)).map(d => ({
                                title: 'Daily CA Quiz',
                                date: d,
                                questions: groupedByDate[d]
                            }));
                        }
                        combinedCA = rawCA.map(formatQuiz);

                        let rawStatic = data.static_quizzes || [];
                        if (rawStatic.length > 0 && !rawStatic[0].questions) {
                            const groupedByDate = {};
                            rawStatic.forEach(q => {
                                const qDate = (q.Date || q.date || new Date().toISOString()).split('T')[0];
                                if (!groupedByDate[qDate]) groupedByDate[qDate] = [];
                                groupedByDate[qDate].push(q);
                            });
                            rawStatic = Object.keys(groupedByDate).sort((a,b) => b.localeCompare(a)).map(d => ({
                                title: 'Static Practice Quiz',
                                date: d,
                                questions: groupedByDate[d]
                            }));
                        }
                        combinedStatic = rawStatic.map(formatQuiz);
                    }

                    // 3. Fallback to Local Archive if absolutely nothing works
                    if (combinedCA.length === 0 && combinedStatic.length === 0) {
                        try {
                            const staticRes = await fetch(STATIC_ARCHIVE_URL);
                            if (staticRes.ok) {
                                const data = await staticRes.json();
                                const rawCA = data.ca_quizzes || (Array.isArray(data) ? [{ title: 'Daily Quiz', questions: data }] : []);
                                combinedCA = rawCA.map(formatQuiz);
                                combinedStatic = [...combinedStatic, ...(data.static_quizzes || []).map(formatQuiz)];
                            }
                        } catch (e) { console.log("No static archive found either."); }
                    }
                }

                setCaQuizzes(combinedCA);
                setStaticQuizzes(combinedStatic);
                setIsLoading(false);
            } catch (err) {
                console.error("Global Quiz Error:", err);
                setError('Unable to load quizzes. Please check your connection.');
                setIsLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const startQuiz = (quiz) => {
        if (!quiz || !quiz.questions || quiz.questions.length === 0) return;
        setSelectedQuiz(quiz);
        setTestStarted(true);
        setCurrentQ(0);
        setScore(0);
        setFinished(false);
        setShowExplanation(false);
    }

    const handleAnswer = (idx) => {
        const currentQData = selectedQuiz?.questions?.[currentQ];
        if (currentQData && idx === currentQData.correct) setScore(score + 1)
        setShowExplanation(true)
    }

    const nextQuestion = () => {
        setShowExplanation(false)
        if (currentQ + 1 < (selectedQuiz?.questions?.length || 0)) setCurrentQ(currentQ + 1)
        else setFinished(true)
    }

    if (isLoading) return (
        <div className="mocktest-container flex-center" style={{ textAlign: 'center', height: '60vh' }}>
            <Loader2 className="spinner" size={40} style={{ margin: '0 auto 1rem' }} />
            <p>Accessing Exam Archives...</p>
        </div>
    );

    if (error) return (
        <div className="mocktest-container flex-center" style={{ textAlign: 'center', height: '60vh' }}>
            <AlertCircle color="#ef4444" size={40} style={{ margin: '0 auto 1rem' }} />
            <p>{error}</p>
        </div>
    );

    const activeLibrary = (activeSubTab === 'ca' ? caQuizzes : staticQuizzes).filter(q => q.questions && q.questions.length > 0);

    return (
        <div className="multi-page-view">
            {!testStarted && (
                <div className="page-header-banner">
                    <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>Daily <span className="accent-text">Quiz</span></motion.h1>
                    <p>Sharpen your knowledge with our daily updated question bank.</p>
                    <div className="breadcrumbs">
                        <Link to="/">Home</Link>
                        <span className="breadcrumb-separator"><ChevronRight size={12} /></span>
                        <span className="breadcrumb-current">Daily Quiz</span>
                    </div>
                </div>
            )}

            <div className="mocktest-container">
                {!testStarted && (
                    <div className="tabs" style={{ marginBottom: '2rem' }}>
                        <button className={`tab-btn ${activeSubTab === 'ca' ? 'active' : ''}`} onClick={() => setActiveSubTab('ca')}>Current Affairs Quizzes</button>
                        <button className={`tab-btn ${activeSubTab === 'static' ? 'active' : ''}`} onClick={() => setActiveSubTab('static')}>Static Quizzes</button>
                    </div>
                )}
            </div>

            {!testStarted ? (
                <div className="quiz-library-grid">
                    {activeLibrary.length > 0 ? (
                        activeLibrary.map((quiz, idx) => (
                            <motion.div
                                key={idx}
                                className="quiz-library-card glass-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="quiz-lib-meta">
                                    <span className="badge">{quiz.category || (activeSubTab === 'ca' ? 'Daily CA' : 'Static')}</span>
                                    {quiz.date && <span className="date">{quiz.date}</span>}
                                </div>
                                <h3>{quiz.title}</h3>
                                <p>{quiz.questions.length} Questions</p>
                                <button className="btn btn-primary" onClick={() => startQuiz(quiz)}>Practice Now</button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="empty-state glass-card" style={{ gridColumn: '1/-1' }}>
                            <p>No quizzes available in this section yet.</p>
                        </div>
                    )}
                </div>
            ) : finished ? (
                <div className="test-result glass-card">
                    <h2>Score: {score}/{selectedQuiz.questions.length}</h2>
                    <p>{Math.round((score / selectedQuiz.questions.length) * 100)}% Proficiency</p>
                    <button className="btn btn-secondary" onClick={() => { setTestStarted(false); setFinished(false); }}><RefreshCw size={18} /> Back to Library</button>
                </div>
            ) : selectedQuiz ? (
                <motion.div className="quiz-card glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="quiz-meta">
                        <span>{selectedQuiz.title}</span>
                        <span>Q {currentQ + 1}/{selectedQuiz.questions.length}</span>
                    </div>
                    <h3 style={{ lineHeight: '1.5' }}>
                        <div>{selectedQuiz.questions[currentQ].q}</div>
                        {selectedQuiz.questions[currentQ].qHindi && (
                            <div className="hindi-text" style={{ fontSize: '0.95em', color: 'var(--text-muted)', marginTop: '0.6rem', fontWeight: 'normal', fontFamily: 'system-ui' }}>
                                {selectedQuiz.questions[currentQ].qHindi}
                            </div>
                        )}
                    </h3>
                    <div className="options-grid">
                        {selectedQuiz.questions[currentQ].options.map((opt, idx) => {
                            const optHindi = selectedQuiz.questions[currentQ].optionsHindi?.[idx];
                            return (
                                <button
                                    key={idx}
                                    className={`option-btn ${showExplanation ? (idx === selectedQuiz.questions[currentQ].correct ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => !showExplanation && handleAnswer(idx)}
                                    disabled={showExplanation}
                                    style={{ alignItems: 'flex-start' }}
                                >
                                    <span className="opt-label" style={{ marginTop: '2px' }}>{String.fromCharCode(65 + idx)}.</span>
                                    <div className="opt-text" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', flex: 1 }}>
                                        <span>{opt}</span>
                                        {optHindi && (
                                            <span style={{ fontSize: '0.9em', color: 'var(--text-muted)', marginTop: '0.3rem', fontFamily: 'system-ui' }}>
                                                {optHindi}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {showExplanation && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="explanation-box">
                            <div className="explanation-header">
                                <Award size={16} className="accent-text" />
                                <span>Review & Explanation</span>
                            </div>
                            <div className="message-content">
                                <p className="explanation-text">{selectedQuiz.questions[currentQ].explanation}</p>
                            </div>
                            <button className="btn btn-primary" onClick={nextQuestion}>Next Question &rarr;</button>
                        </motion.div>
                    )}
                </motion.div>
            ) : null}
        </div>
    )
}

export default DailyQuiz
