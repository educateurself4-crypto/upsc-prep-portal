import React from 'react'

const About = () => {
    return (
        <div className="about-container">
            <div className="section-header">
                <h2>About <span className="accent-text">Educate Yourself</span></h2>
            </div>
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
                    <li><strong>Full Syllabus</strong>: Deep dive into all subject areas.</li>
                </ul>

                <h3>Contact Us</h3>
                <p>Email: contact@educateurself.net</p>
            </div>
        </div>
    )
}

export default About
