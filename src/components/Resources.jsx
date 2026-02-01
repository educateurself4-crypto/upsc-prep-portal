import React from 'react'
import { Download, ExternalLink, FileText } from 'lucide-react'

const Resources = () => {
    const categories = [
        { title: 'NCERT Texts', items: ['Class 6-12 History', 'Geography Fundamentals', 'Indian Polity for Class 11'] },
        { title: 'Daily News', items: ['The Hindu Highlights', 'Indian Express Explained', 'Rajya Sabha TV Summaries'] },
        { title: 'Standard Books', items: ['Laxmikanth (Polity)', 'Spectrum (Mod. History)', 'Ramesh Singh (Economy)'] }
    ]

    return (
        <div className="resources-container">
            <div className="section-header">
                <h2>Resource <span className="accent-text">Library</span></h2>
                <p>Expertly curated materials for your UPSC journey.</p>
            </div>

            <div className="resource-sections">
                {categories.map((cat, idx) => (
                    <div key={idx} className="resource-category">
                        <h3>{cat.title}</h3>
                        <div className="resource-list">
                            {cat.items.map((item, id) => (
                                <div key={id} className="resource-item glass-card">
                                    <div className="item-info">
                                        <FileText size={20} className="accent-text" />
                                        <span>{item}</span>
                                    </div>
                                    <div className="item-actions">
                                        <button className="icon-btn" title="Download"><Download size={18} /></button>
                                        <button className="icon-btn" title="View"><ExternalLink size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Resources
