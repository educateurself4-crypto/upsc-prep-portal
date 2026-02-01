import React from 'react'
import { BookOpen, Library, CheckSquare, Home, Award } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = ({ setActiveSection }) => {
    return (
        <nav className="navbar">
            <div className="nav-logo" onClick={() => setActiveSection('home')}>
                <BookOpen className="logo-icon" />
                <span>UPSC Prep Hub</span>
            </div>
            <ul className="nav-links">
                <li onClick={() => setActiveSection('home')}>
                    <Home size={18} /> Home
                </li>
                <li onClick={() => setActiveSection('syllabus')}>
                    <BookOpen size={18} /> Syllabus
                </li>
                <li onClick={() => setActiveSection('ca')}>
                    <Library size={18} /> Daily CA
                </li>
                <li onClick={() => setActiveSection('mocktest')}>
                    <Award size={18} /> Mock Test
                </li>
                <li onClick={() => setActiveSection('tracker')}>
                    <CheckSquare size={18} /> Tracker
                </li>
                <li onClick={() => setActiveSection('about')}>
                    <Home size={18} /> About
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
