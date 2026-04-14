import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Rocket, Target, Award, BookOpen, Quote, Scissors, Zap, Bell, ChevronRight } from 'lucide-react'

const Hero = () => {
    const navigate = useNavigate();

    const notifications = [
        { name: 'UPSC CSE 2026 Official Notification', link: '/UPSC_CSE_2026_Notification.pdf' },
        { name: 'Economic Survey 2025-2026', link: 'https://www.indiabudget.gov.in/economicsurvey/doc/echapter.pdf' },
        { name: 'आर्थिक सर्वेक्षण 2025-26', link: 'https://www.indiabudget.gov.in/economicsurvey/doc/hechapter.pdf' },
        { name: 'Budget 2026', link: 'https://www.indiabudget.gov.in/doc/Budget_at_Glance/budget_at_a_glance.pdf' },
        { name: 'UPSC Exam Calendar 2026', link: 'https://upsc.gov.in/sites/default/files/Calendar-2026-Engl-150525_5.pdf' }
    ];
    const Quotes = [
        { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
        { text: "Educating the mind without educating the heart is no education at all.", author: "Aristotle" },
        { text: "Integrity is doing the right thing, even when no one is watching.", author: "C.S. Lewis" },
        { text: "In law a man is guilty when he violates the rights of others. In ethics he is guilty if he only thinks of doing so.", author: "Immanuel Kant" },
        { text: "Relativity applies to physics, not ethics.", author: "Albert Einstein" },
        { text: "Action without philosophy is a lethal weapon; philosophy without action is worthless.", author: "Soichiro Honda" },
        { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
        { text: "Earth provides enough to satisfy every man's needs, but not every man's greed.", author: "Mahatma Gandhi" },
        { text: "The unexamined life is not worth living.", author: "Socrates" },
        { text: "Non-violence is the greatest force at the disposal of mankind.", author: "Mahatma Gandhi" }
    ];
    const dailyQuote = Quotes[Math.floor(Math.random() * Quotes.length)];

    const shortcuts = [
        { id: '/syllabus', icon: <BookOpen size={20} />, label: 'Syllabus', color: 'var(--accent)' },
        { id: '/daily-notes', icon: <Zap size={20} />, label: 'Daily Notes', color: '#fbbf24' },
        { id: '/daily-quiz', icon: <Target size={20} />, label: 'Daily Quiz', color: '#f87171' },
        { id: '/infographics', icon: <Scissors size={20} />, label: 'Mind Maps', color: '#60a5fa' },
    ];

    return (
        <section className="hero">
            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <h1 className="hero-title">Elevate Your <br /><span className="accent-text">UPSC Journey</span></h1>
                <p className="hero-subtitle">
                    The premium ecosystem for India's toughest exam. Structured content, active tracking, and AI-driven growth.
                </p>

                {/* Prominent Daily Quiz Tab */}
                <motion.button
                    className="daily-quiz-highlight glass-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => navigate('/daily-quiz')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    style={{
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(251, 191, 36, 0.1))',
                        border: '1px solid var(--accent-color)',
                        width: '100%',
                        maxWidth: '600px',
                        marginBottom: '1rem',
                        padding: '1rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'inherit'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Target size={28} className="accent-text" />
                        <div style={{ textAlign: 'left' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', textTransform: 'none', letterSpacing: 'normal' }}>Take Today's Daily Quiz</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Current Affairs & Static MCQ</p>
                        </div>
                    </div>
                    <ChevronRight size={20} className="accent-text" />
                </motion.button>

                <motion.div
                    className="daily-quote glass-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '1rem', width: '100%', maxWidth: '600px', marginBottom: '1rem' }}
                >
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', fontWeight: 'bold', alignSelf: 'flex-start' }}>Today's Quote</div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left' }}>
                        <Quote size={20} className="accent-text" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.4' }}>"{dailyQuote.text}"</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', alignSelf: 'flex-end', fontStyle: 'italic' }}>
                        — {dailyQuote.author}
                    </div>
                </motion.div>
                {/* Latest Notifications Section */}
                <motion.div
                    className="notifications-banner glass-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="notif-header">
                        <Bell size={18} className="accent-text" />
                        <span>Latest Updates</span>
                    </div>
                    <div className="notif-list">
                        {notifications.map((n, i) => (
                            <a key={i} href={n.link} target="_blank" rel="noopener noreferrer" className="notif-item">
                                {n.name} <ChevronRight size={14} />
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* ClearIAS-inspired Quick Access Grid */}
                <div className="quick-access-grid">
                    {shortcuts.map((s) => (
                        <motion.button
                            key={s.id}
                            className="quick-btn glass-card"
                            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            onClick={() => navigate(s.id)}
                        >
                            <span className="q-icon" style={{ color: s.color }}>{s.icon}</span>
                            <span className="q-label">{s.label}</span>
                        </motion.button>
                    ))}
                </div>

                <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => navigate('/syllabus')}>
                        Full Dashboard
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/tracker')}>
                        <Zap size={16} /> My Streaks
                    </button>
                </div>
            </motion.div>

            <div className="hero-stats">
                <motion.div className="stat-card glass-card" whileHover={{ scale: 1.05 }}>
                    <Target className="stat-icon" />
                    <h3>850+</h3>
                    <p>Topics Covered</p>
                </motion.div>
                <motion.div className="stat-card glass-card" whileHover={{ scale: 1.05 }}>
                    <Award className="stat-icon" />
                    <h3>Daily</h3>
                    <p>Cloud Updates</p>
                </motion.div>
                <motion.div className="stat-card glass-card" whileHover={{ scale: 1.05 }}>
                    <Target className="stat-icon" />
                    <h3>Premium</h3>
                    <p>Ad-Free Portal</p>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero
