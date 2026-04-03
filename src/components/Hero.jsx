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
    const quotes = [
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "Your only limit is your mind. Stay focused on the goal.",
        "The secret of getting ahead is getting started.",
        "IAS is not just a job, it's a responsibility. Prepare like a servant of the nation."
    ];
    const dailyQuote = quotes[Math.floor(Math.random() * quotes.length)];

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

                <motion.div
                    className="daily-quote glass-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Quote size={14} className="accent-text" />
                    <span>{dailyQuote}</span>
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
