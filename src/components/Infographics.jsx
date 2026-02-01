import React from 'react'
import { motion } from 'framer-motion'
import { Image, Maximize2, Download } from 'lucide-react'

const Infographics = () => {
    const maps = [
        { id: 1, title: 'Constitutional Bodies', category: 'Polity', color: '#6366f1' },
        { id: 2, title: 'Indian Monsoon System', category: 'Geography', color: '#3b82f6' },
        { id: 3, title: 'Indus Valley Civilization', category: 'History', color: '#f59e0b' },
        { id: 4, title: 'Economic Survey 2026', category: 'Economy', color: '#10b981' },
    ];

    return (
        <div className="infographics-container">
            <div className="section-header">
                <h2>Visual <span className="accent-text">Learning</span></h2>
                <p>Drishti-styled scannable mind maps and infographics.</p>
            </div>

            <div className="info-grid">
                {maps.map((item) => (
                    <motion.div
                        key={item.id}
                        className="info-card glass-card"
                        whileHover={{ y: -10 }}
                    >
                        <div className="info-preview" style={{ background: `linear-gradient(135deg, ${item.color}44, ${item.color}11)` }}>
                            <Image size={48} className="faint-icon" />
                            <span className="info-badge" style={{ backgroundColor: item.color }}>{item.category}</span>
                        </div>
                        <div className="info-details">
                            <h3>{item.title}</h3>
                            <div className="info-actions">
                                <button className="info-btn"><Maximize2 size={14} /> View</button>
                                <button className="info-btn"><Download size={14} /> PDF</button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="info-cta glass-card">
                <p>New Mind Maps added every week via n8n integration.</p>
            </div>
        </div>
    )
}

export default Infographics
