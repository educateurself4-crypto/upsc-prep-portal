import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const About = () => {
    return (
        <div className="multi-page-view">
            <div className="page-header-banner">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>About <span className="accent-text">Us</span></motion.h1>
                <p>Learn more about our mission to democratize UPSC preparation.</p>
                <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb-separator"><ChevronRight size={12} /></span>
                    <span className="breadcrumb-current">About</span>
                </div>
            </div>

            <div className="about-container">
                <div className="about-content glass-card">
                    <h3>Our Mission</h3>
                    <p>
                        To empower UPSC aspirants with high-quality, free accessibility to preparation materials.
                        We believe that financial constraints should never stand in the way of achieving your dreams of serving the nation.
                    </p>

                    <h3>Why Choose Us?</h3>
                    <ul>
                        <li><strong>Curated CA</strong>: Daily notes and MCQs specifically for UPSC.</li>
                        <li><strong>Progress Tracking</strong>: Built-in local tracker for study hours.</li>
                        <li><strong>Full Syllabus</strong>: Deep dive into all GS topics.</li>
                    </ul>

                    <h3 className="section-subtitle">Frequently Asked Questions</h3>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>Is the material available offline?</h4>
                            <p>Currently, the dashboard requires an active internet connection to fetch the latest cloud updates.</p>
                        </div>
                        <div className="faq-item">
                            <h4>How often are the MCQs updated?</h4>
                            <p>We push new MCQs daily through our automated backend to keep your practice fresh.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Can I track my progress across devices?</h4>
                            <p>Your progress is saved locally on your browser. For cross-device sync, stay tuned for our cloud update.</p>
                        </div>
                    </div>

                    <h3 className="section-subtitle">Contact Support</h3>
                    <div className="contact-box">
                        <p>Have suggestions or need help? Reach out directly:</p>
                        <a href="mailto:support@educateurself.net" className="contact-link">support@educateurself.net</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
