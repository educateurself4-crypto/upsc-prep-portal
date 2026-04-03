import React from 'react'
import { BookOpen, Library, CheckSquare, Home, Award, Menu, X, Sparkles } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo" onClick={closeMenu}>
                <img src="/logo.jpg" alt="Educate UrSelf Logo" className="logo-img" />
                <span>Educate <span className="accent-text">UrSelf</span></span>
            </Link>

            <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <ul className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
                        <Home size={18} /> Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/syllabus" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
                        <BookOpen size={18} /> Syllabus
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/daily-notes" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
                        <Library size={18} /> Daily Notes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/daily-quiz" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
                        <Award size={18} /> Daily Quiz
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/ai-mentor" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
                        <Sparkles size={18} /> AI Mentor
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/resources" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
                        <Library size={18} /> Resources
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/tracker" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
                        <CheckSquare size={18} /> Tracker
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
                        <Home size={18} /> About
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
