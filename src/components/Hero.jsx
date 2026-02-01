import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, Target, Award, BookOpen, Quote, Scissors, Zap } from 'lucide-react'

const Hero = ({ setActiveSection }) => {
    const shortcuts = [
        { id: 'syllabus', icon: <BookOpen size={20} />, label: 'Syllabus', color: 'var(--accent)' },
        { id: 'ca', icon: <Zap size={20} />, label: 'Daily CA', color: '#fbbf24' },
        { id: 'mock', icon: <Target size={20} />, label: 'Mock Test', color: '#f87171' },
        { id: 'infographics', icon: <Scissors size={20} />, label: 'Mind Maps', color: '#60a5fa' },
    ];

    return (
        <section className="hero">
            <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="hero-title">Elevate Your <br /><span className="accent-text">UPSC Journey</span></h1>
                <p className="hero-subtitle">
                    The premium ecosystem for India's toughest exam. Structured content, active tracking, and AI-driven growth.
                </p>

                {/* ClearIAS-inspired Quick Access Grid */}
                <div className="quick-access-grid">
                    {shortcuts.map((s) => (
                        <motion.button
                            key={s.id}
                            className="quick-btn glass-card"
                            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            onClick={() => setActiveSection(s.id)}
                        >
                            <span className="q-icon" style={{ color: s.color }}>{s.icon}</span>
                            <span className="q-label">{s.label}</span>
                        </motion.button>
                    ))}
                </div>

                <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => setActiveSection('syllabus')}>
                        Full Dashboard
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveSection('tracker')}>
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
                    <p>n8n Updates</p>
                </motion.div>
                <motion.div className="stat-card glass-card" whileHover={{ scale: 1.05 }}>
                    <Rocket className="stat-icon" />
                    <h3>Premium</h3>
                    <p>Ad-Free Portal</p>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero
