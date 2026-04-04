import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Syllabus from './components/Syllabus'
import Resources from './components/Resources'
import Tracker from './components/Tracker'
import DailyNotes from './components/DailyNotes'
import DailyQuiz from './components/DailyQuiz'
import About from './components/About'
import Ip from './components/Infographics'
import AIChat from './components/AIChat'
import AIMentor from './components/AIMentor'
import VisitorCounter from './components/VisitorCounter'
import ScrollToTop from './components/ScrollToTop'
import { useEffect } from 'react'

const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

function App() {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let title = "UPSC Prep Portal";

        if (path === '/daily-notes') title = "Daily Notes | UPSC Prep Portal";
        else if (path === '/daily-quiz') title = "Daily Quiz | UPSC Prep Portal";
        else if (path === '/syllabus') title = "Syllabus Tracker | UPSC Prep Portal";
        else if (path === '/resources') title = "Resources | UPSC Prep Portal";
        else if (path === '/ai-mentor') title = "AI Mentor | UPSC Prep Portal";
        else if (path === '/about') title = "About Us | UPSC Prep Portal";

        document.title = title;
    }, [location]);

    return (
        <div className="app-container">
            <ScrollToTop />
            <Navbar />
            <main>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageWrapper><Hero /></PageWrapper>} />
                        <Route path="/syllabus" element={<PageWrapper><Syllabus /></PageWrapper>} />
                        <Route path="/daily-notes" element={<PageWrapper><DailyNotes /></PageWrapper>} />
                        <Route path="/daily-quiz" element={<PageWrapper><DailyQuiz /></PageWrapper>} />
                        <Route path="/ai-mentor" element={<PageWrapper><AIMentor /></PageWrapper>} />
                        <Route path="/infographics" element={<PageWrapper><Ip /></PageWrapper>} />
                        <Route path="/resources" element={<PageWrapper><Resources /></PageWrapper>} />
                        <Route path="/tracker" element={<PageWrapper><Tracker /></PageWrapper>} />
                        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                    </Routes>
                </AnimatePresence>
            </main>
            <AIChat />
            <footer>
                <div className="footer-content">
                    <p>&copy; 2026 Educate UrSelf. Built for Serious Aspirants.</p>
                    <VisitorCounter />
                </div>
            </footer>
            <Analytics />
        </div>
    )
}

export default App
