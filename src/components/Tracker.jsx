import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Calendar, Zap, TrendingUp, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const Tracker = () => {
    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem('upsc-study-logs')
        return saved ? JSON.parse(saved) : []
    })
    const [subject, setSubject] = useState('')
    const [hours, setHours] = useState('')
    const [streak, setStreak] = useState(0)

    useEffect(() => {
        localStorage.setItem('upsc-study-logs', JSON.stringify(logs))
        calculateStreak()
    }, [logs])

    const calculateStreak = () => {
        if (logs.length === 0) {
            setStreak(0)
            return
        }

        const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))
        const today = new Date().toLocaleDateString()

        let currentStreak = 0
        let lastDate = null

        // Find unique dates
        const uniqueDates = [...new Set(sortedLogs.map(l => l.date))]

        if (uniqueDates[0] === today) {
            currentStreak = 1
            for (let i = 0; i < uniqueDates.length - 1; i++) {
                const date1 = new Date(uniqueDates[i])
                const date2 = new Date(uniqueDates[i + 1])
                const diffTime = Math.abs(date1 - date2)
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                if (diffDays === 1) {
                    currentStreak++
                } else {
                    break
                }
            }
        }
        setStreak(currentStreak)
    }

    const addLog = (e) => {
        e.preventDefault()
        if (!subject || !hours) return
        const newLog = {
            id: Date.now(),
            subject,
            hours: parseFloat(hours),
            date: new Date().toLocaleDateString()
        }
        setLogs([newLog, ...logs])
        setSubject('')
        setHours('')
    }

    const deleteLog = (id) => {
        setLogs(logs.filter(log => log.id !== id))
    }

    const totalHours = logs.reduce((sum, log) => sum + log.hours, 0)
    const todayHours = logs
        .filter(l => l.date === new Date().toLocaleDateString())
        .reduce((sum, l) => sum + l.hours, 0)

    const dailyGoal = 8 // Hardcoded for now
    const progressPercent = Math.min((todayHours / dailyGoal) * 100, 100)

    return (
        <div className="tracker-container">
            <div className="section-header">
                <h2>Study <span className="accent-text">Intelligence</span></h2>
                <p>Track gains, maintain streaks, and master consistency.</p>
            </div>

            <div className="tracker-top-stats">
                <div className="stat-card streak-card glass-card">
                    <Zap className="streak-icon" />
                    <div className="stat-info">
                        <span className="stat-label">Current Streak</span>
                        <span className="stat-value">{streak} Days</span>
                    </div>
                </div>
                <div className="stat-card progress-card glass-card">
                    <div className="progress-ring-container">
                        <svg className="progress-ring" width="60" height="60">
                            <circle className="ring-bg" cx="30" cy="30" r="25" />
                            <motion.circle
                                className="ring-fill"
                                cx="30" cy="30" r="25"
                                initial={{ strokeDashoffset: 157 }}
                                animate={{ strokeDashoffset: 157 - (157 * progressPercent) / 100 }}
                            />
                        </svg>
                        <span className="progress-text">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Daily Goal ({dailyGoal}h)</span>
                        <span className="stat-value">{todayHours}h Logged</span>
                    </div>
                </div>
            </div>

            <div className="tracker-layout">
                <div className="tracker-form glass-card">
                    <h3>Log Focus Session</h3>
                    <form onSubmit={addLog}>
                        <div className="form-group">
                            <label>Core Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="History, CSAT, etc."
                            />
                        </div>
                        <div className="form-group">
                            <label>Effort (Hours)</label>
                            <input
                                type="number"
                                step="0.5"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                placeholder="0.0"
                            />
                        </div>
                        <button className="btn btn-primary btn-block" type="submit">
                            <Plus size={18} /> Record Gain
                        </button>
                    </form>
                </div>

                <div className="tracker-list">
                    <div className="list-header">
                        <h3>Session History</h3>
                        <span className="total-label">Lifetime: <b className="accent-text">{totalHours}h</b></span>
                    </div>
                    <div className="logs-scroll">
                        {logs.length === 0 ? (
                            <div className="no-logs">
                                <TrendingUp size={48} className="faint-icon" />
                                <p>Your journey begins with the first hour. Log it now!</p>
                            </div>
                        ) : (
                            logs.map(log => (
                                <motion.div
                                    key={log.id}
                                    className="log-item glass-card"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <div className="log-main">
                                        <div className="log-subject-flex">
                                            <CheckCircle2 size={14} className="accent-text" />
                                            <span className="log-subject">{log.subject}</span>
                                        </div>
                                        <span className="log-date"><Calendar size={12} /> {log.date}</span>
                                    </div>
                                    <div className="log-side">
                                        <span className="log-hours">{log.hours}h</span>
                                        <button className="delete-btn" onClick={() => deleteLog(log.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tracker
