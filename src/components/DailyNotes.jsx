import Papa from 'papaparse'
import React, { useState, useEffect } from 'react'
import { Calendar, Search, ChevronRight, HelpCircle, Loader2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchWithCache } from '../utils/cacheManager'

// --- CONTENT SOURCES ---
const GSHEET_NOTES_CSV_URL = ''; // Add your "Published as CSV" Google Sheet URL here
const N8N_CA_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/get-upsc-content';
const STATIC_ARCHIVE_URL = import.meta.env.BASE_URL + 'data/upsc_content.json';

const DailyNotes = () => {
    const [activeTab, setActiveTab] = useState('ca')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [notes, setNotes] = useState([])
    const [staticNotes, setStaticNotes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                let combinedNotes = [];
                let combinedStatic = [];

                // 1. Try Google Sheets (If URL provided)
                if (GSHEET_NOTES_CSV_URL) {
                    try {
                        const response = await fetch(GSHEET_NOTES_CSV_URL);
                        const csvText = await response.text();
                        const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });

                        const sheetData = results.data.map(row => ({
                            title: row.Title || 'Untitled',
                            category: row.Category || 'General',
                            summary: row.Summary || row.Content || '',
                            date: row.Date || 'Recent',
                            type: (row.Type || 'daily').toLowerCase()
                        }));

                        combinedNotes = sheetData.filter(n => n.type === 'daily');
                        combinedStatic = sheetData.filter(n => n.type === 'static');
                    } catch (e) {
                        console.error("GSheet Fetch Error:", e);
                    }
                }

                // 2. Fetch from n8n (with caching)
                if (combinedNotes.length === 0) {
                    const data = await fetchWithCache('n8n_daily_notes_cache', N8N_CA_WEBHOOK_URL);
                    
                    if (data) {
                        combinedNotes = data.notes || [];
                        combinedStatic = data.static_notes || [];
                    }

                    // 3. Fallback to Local Archive if n8n fails
                    if (combinedNotes.length === 0) {
                        try {
                            const response = await fetch(STATIC_ARCHIVE_URL);
                            if (response.ok) {
                                const staticData = await response.json();
                                combinedNotes = staticData.notes || [];
                                combinedStatic = staticData.static_notes || [];
                            }
                        } catch (e) {
                            console.log("No static archive found.")
                        }
                    }
                }

                setNotes(combinedNotes);
                setStaticNotes(combinedStatic);

                // Set default month
                if (combinedNotes.length > 0) {
                    const latestDate = combinedNotes[0].date;
                    const parts = latestDate.split(' ');
                    if (parts.length >= 3) {
                        const month = parts[0] + ' ' + parts[2];
                        setSelectedMonth(month);
                    }
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Cloud Fetch Error:", err);
                setError('Network Error: Could not connect to the cloud stores.');
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterNotes = (list) => {
        return list.filter(item => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.summary.toLowerCase().includes(searchQuery.toLowerCase());

            // Only filter Daily CA by month, Static notes are always visible
            if (activeTab === 'ca') {
                const itemMonth = item.date.split(' ')[0] + ' ' + item.date.split(' ')[2];
                return matchesSearch && itemMonth === selectedMonth;
            }

            return matchesSearch;
        });
    }

    const activeList = filterNotes(activeTab === 'ca' ? notes : staticNotes);

    // Get unique months for the dropdown
    const availableMonths = [...new Set(notes.map(n => n.date.split(' ')[0] + ' ' + n.date.split(' ')[2]))];

    return (
        <div className="multi-page-view">
            <div className="page-header-banner">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>Daily <span className="accent-text">Notes</span></motion.h1>
                <p>Curated study materials for UPSC Current Affairs and Static GS.</p>
                <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb-separator"><ChevronRight size={12} /></span>
                    <span className="breadcrumb-current">Daily Notes</span>
                </div>
            </div>

            <div className="ca-container">
                <div className="ca-controls">
                    <div className="tabs">
                        <button className={`tab-btn ${activeTab === 'ca' ? 'active' : ''}`} onClick={() => { setActiveTab('ca'); setSearchQuery('') }}>Daily Current Affairs</button>
                        <button className={`tab-btn ${activeTab === 'static' ? 'active' : ''}`} onClick={() => { setActiveTab('static'); setSearchQuery('') }}>Static Notes</button>
                    </div>
                    <div className="archive-search glass-card">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {activeTab === 'ca' && (
                        <div className="archive-filter glass-card">
                            <Calendar size={14} />
                            <select
                                className="archive-select"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab + searchQuery + selectedMonth}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ca-content"
                >
                    {isLoading ? (
                        <div className="loading-state"><Loader2 className="spinner" /><p>Accessing Archive...</p></div>
                    ) : error ? (
                        <div className="error-state"><AlertCircle color="#ef4444" /><p>{error}</p></div>
                    ) : activeList.length > 0 ? (
                        activeList.map((note, idx) => (
                            <div key={idx} className="ca-item glass-card">
                                <div className="item-meta">
                                    <span className="badge">{note.category}</span>
                                    <span className="date"><Calendar size={12} /> {note.date}</span>
                                </div>
                                <h3>{note.title}</h3>
                                <div className="message-content">
                                    <p>{note.summary}</p>
                                </div>
                                <button className="text-btn">Read Full Note &rarr;</button>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state glass-card">
                            <HelpCircle size={40} className="accent-text" />
                            <p>{searchQuery ? 'No notes match your search.' : 'No notes found for this period.'}</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default DailyNotes
