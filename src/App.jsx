import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Syllabus from './components/Syllabus'
import Resources from './components/Resources'
import Tracker from './components/Tracker'
import CurrentAffairs from './components/CurrentAffairs'
import MockTest from './components/MockTest'
import About from './components/About'

import Infographics from './components/Infographics'
import AIChat from './components/AIChat'

function App() {
    const [activeSection, setActiveSection] = useState('home')

    return (
        <div className="app-container">
            <Navbar setActiveSection={setActiveSection} />
            <main>
                {activeSection === 'home' && <Hero setActiveSection={setActiveSection} />}
                {activeSection === 'syllabus' && <Syllabus />}
                {activeSection === 'ca' && <CurrentAffairs />}
                {activeSection === 'mocktest' && <MockTest />}
                {activeSection === 'infographics' && <Infographics />}
                {activeSection === 'resources' && <Resources />}
                {activeSection === 'tracker' && <Tracker />}
                {activeSection === 'about' && <About />}
            </main>
            <AIChat />
            <footer>
                <p>&copy; 2026 UPSC Prep Hub. Built for Serious Aspirants.</p>
            </footer>
        </div>
    )
}

export default App
