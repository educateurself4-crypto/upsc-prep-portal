import React from 'react'
import { Download, ExternalLink, FileText, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Resources = () => {
    const categories = [
        {
            title: 'Official Portals',
            items: [
                { name: 'UPSC Official Site', link: 'https://upsc.gov.in', type: 'link' },
                { name: 'PIB (Press Information Bureau)', link: 'https://pib.gov.in', type: 'link' },
                { name: 'National Portal of India', link: 'https://india.gov.in', type: 'link' }
            ]
        },
        {
            title: 'Foundation (NCERTs)',
            items: [
                { name: 'History Class 6-12 (Old & New)', link: 'https://ncert.nic.in/textbook.php', type: 'pdf' },
                { name: 'Geography: Fundamentals of Physical Geography', link: 'https://ncert.nic.in/textbook.php', type: 'pdf' },
                { name: 'Indian Constitution at Work', link: 'https://ncert.nic.in/textbook.php', type: 'pdf' }
            ]
        },
        {
            title: 'Standard References',
            items: [
                { name: 'Polity: M. Laxmikanth (6th Ed)', type: 'book' },
                { name: 'Modern History: Spectrum', type: 'book' },
                { name: 'Economy: Nitin Singhania / Ramesh Singh', type: 'book' }
            ]
        }
    ]

    return (
        <div className="multi-page-view">
            <div className="page-header-banner">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>Study <span className="accent-text">Resources</span></motion.h1>
                <p>Essential downloads, books, and portals for UPSC preparation.</p>
                <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb-separator"><ChevronRight size={12} /></span>
                    <span className="breadcrumb-current">Resources</span>
                </div>
            </div>

            <div className="resources-container">
                <div className="resource-sections">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="resource-category">
                            <h3>{cat.title}</h3>
                            <div className="resource-list">
                                {cat.items.map((item, i) => (
                                    <div key={i} className="resource-item glass-card">
                                        <div className="item-info">
                                            <FileText className="accent-text" size={20} />
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="item-actions">
                                            {item.link ? (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="icon-btn" title="Open Link">
                                                    <ExternalLink size={18} />
                                                </a>
                                            ) : (
                                                <button className="icon-btn" title="Reference Only" disabled>
                                                    <Download size={18} style={{ opacity: 0.3 }} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Resources
