import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Book, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const Syllabus = () => {
    const [activeTab, setActiveTab] = useState('prelims')
    const [expandedTopics, setExpandedTopics] = useState({})

    const toggleTopic = (id) => {
        setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const syllabusData = {
        prelims: [
            {
                id: 'p1',
                title: 'GS Paper I',
                subTopics: [
                    'Current events of national and international importance.',
                    'History of India and Indian National Movement.',
                    'Indian and World Geography - Physical, Social, Economic Geography of India and the World.',
                    'Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.',
                    'Economic and Social Development - Sustainable Development, Poverty, Inclusion, Demographics, Social Sector initiatives, etc.',
                    'General issues on Environmental Ecology, Bio-diversity and Climate Change - that do not require subject specialization.',
                    'General Science.'
                ]
            },
            {
                id: 'p2',
                title: 'CSAT (Paper II)',
                subTopics: [
                    'Comprehension',
                    'Interpersonal skills including communication skills',
                    'Logical reasoning and analytical ability',
                    'Decision-making and problem-solving',
                    'General mental ability',
                    'Basic numeracy (numbers and their relations, orders of magnitude, etc.) (Class X level), Data interpretation (charts, graphs, tables, data sufficiency etc. — Class X level)'
                ]
            }
        ],
        mains: [
            {
                id: 'm1',
                title: 'GS Paper I: Heritage & Culture, History & Geography',
                subTopics: [
                    'Indian Culture - Salient aspects of Art Forms, Literature and Architecture from ancient to modern times.',
                    'Modern Indian History from about the middle of the eighteenth century until the present- significant events, personalities, issues.',
                    'The Freedom Struggle — its various stages and important contributors/contributions from different parts of the country.',
                    'Post-independence consolidation and reorganization within the country.',
                    'History of the World will include events from 18th century such as industrial revolution, world wars, redrawal of national boundaries, colonization, decolonization, political philosophies like communism, capitalism, socialism etc.— their forms and effect on the society.',
                    'Salient features of Indian Society, Diversity of India.',
                    'Role of women and women’s organization, population and associated issues, poverty and developmental issues, urbanization, their problems and their remedies.',
                    'Effects of globalization on Indian society.',
                    'Social empowerment, communalism, regionalism & secularism.',
                    'Salient features of world’s physical geography.',
                    'Distribution of key natural resources across the world; factors responsible for the location of primary, secondary, and tertiary sector industries in various parts of the world (including India).',
                    'Important Geophysical phenomena such as earthquakes, Tsunami, Volcanic activity, cyclone etc., geographical features and their location-changes in critical geographical features and flora and fauna and the effects of such changes.'
                ]
            },
            {
                id: 'm2',
                title: 'GS Paper II: Governance, Constitution, Polity',
                subTopics: [
                    'Indian Constitution—historical underpinnings, evolution, features, amendments, significant provisions and basic structure.',
                    'Functions and responsibilities of the Union and the States, issues and challenges pertaining to the federal structure, devolution of powers and finances up to local levels and challenges therein.',
                    'Separation of powers between various organs dispute redressal mechanisms and institutions.',
                    'Comparison of the Indian constitutional scheme with that of other countries.',
                    'Parliament and State legislatures—structure, functioning, conduct of business, powers & privileges and issues arising out of these.',
                    'Structure, organization and functioning of the Executive and the Judiciary—Ministries and Departments of the Government; pressure groups and formal/informal associations and their role in the Polity.',
                    'Salient features of the Representation of People’s Act.',
                    'Appointment to various Constitutional posts, powers, functions and responsibilities of various Constitutional Bodies.',
                    'Statutory, regulatory and various quasi-judicial bodies.',
                    'Government policies and interventions for development in various sectors and issues arising out of their design and implementation.',
                    'Development processes and the development industry —the role of NGOs, SHGs, various groups and associations, donors, charities, institutional and other stakeholders.',
                    'Welfare schemes for vulnerable sections of the population by the Centre and States and the performance of these schemes.',
                    'Issues relating to development and management of Social Sector/Services relating to Health, Education, Human Resources.',
                    'Issues relating to poverty and hunger.',
                    'Important aspects of governance, transparency and accountability, e-governance- applications, models, successes, limitations, and potential; citizens charters, transparency & accountability and institutional and other measures.',
                    'Role of civil services in a democracy.',
                    'India and its neighborhood- relations.',
                    'Bilateral, regional and global groupings and agreements involving India and/or affecting India’s interests.',
                    'Effect of policies and politics of developed and developing countries on India’s interests, Indian diaspora.',
                    'Important International institutions, agencies and fora- their structure, mandate.'
                ]
            },
            {
                id: 'm3',
                title: 'GS Paper III: Technology, Economic Development, Environment',
                subTopics: [
                    'Indian Economy and issues relating to planning, mobilization, of resources, growth, development and employment.',
                    'Inclusive growth and issues arising from it.',
                    'Government Budgeting.',
                    'Major crops-cropping patterns in various parts of the country, - different types of irrigation and irrigation systems storage, transport and marketing of agricultural produce and issues and related constraints; e-technology in the aid of farmers.',
                    'Issues related to direct and indirect farm subsidies and minimum support prices; Public Distribution System- objectives, functioning, limitations, revamping; issues of buffer stocks and food security; Technology missions; economics of animal-rearing.',
                    'Food processing and related industries in India- scope’ and significance, location, upstream and downstream requirements, supply chain management.',
                    'Land reforms in India.',
                    'Effects of liberalization on the economy, changes in industrial policy and their effects on industrial growth.',
                    'Infrastructure: Energy, Ports, Roads, Airports, Railways etc.',
                    'Investment models.',
                    'Science and Technology- developments and their applications and effects in everyday life.',
                    'Achievements of Indians in science & technology; indigenization of technology and developing new technology.',
                    'Awareness in the fields of IT, Space, Computers, robotics, nano-technology, bio-technology and issues relating to intellectual property rights.',
                    'Conservation, environmental pollution and degradation, environmental impact assessment.',
                    'Disaster and disaster management.',
                    'Linkages between development and spread of extremism.',
                    'Role of external state and non-state actors in creating challenges to internal security.',
                    'Challenges to internal security through communication networks, role of media and social networking sites in internal security challenges, basics of cyber security; money-laundering and its prevention.',
                    'Security challenges and their management in border areas - linkages of organized crime with terrorism.',
                    'Various Security forces and agencies and their mandate.'
                ]
            },
            {
                id: 'm4',
                title: 'GS Paper IV: Ethics, Integrity and Aptitude',
                subTopics: [
                    'Ethics and Human Interface: Essence, determinants and consequences of Ethics in-human actions; dimensions of ethics; ethics - in private and public relationships.',
                    'Human Values - lessons from the lives and teachings of great leaders, reformers and administrators; role of family society and educational institutions in inculcating values.',
                    'Attitude: content, structure, function; its influence and relation with thought and behavior; moral and political attitudes; social influence and persuasion.',
                    'Aptitude and foundational values for Civil Service, integrity, impartiality and non-partisanship, objectivity, dedication to public service, empathy, tolerance and compassion towards the weaker-sections.',
                    'Emotional intelligence-concepts, and their utilities and application in administration and governance.',
                    'Contributions of moral thinkers and philosophers from India and world.',
                    'Public/Civil service values and Ethics in Public administration.',
                    'Probity in Governance: Concept of public service; Philosophical basis of governance and probity; Information sharing and transparency in government, Right to Information, Codes of Ethics, Codes of Conduct, Citizen’s Charters, Work culture, Quality of service delivery, Utilization of public funds, challenges of corruption.',
                    'Case Studies on above issues.'
                ]
            }
        ]
    }

    return (
        <div className="multi-page-view">
            <div className="page-header-banner">
                <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>Syllabus <span className="accent-text">Dashboard</span></motion.h1>
                <p>Complete breakdown of UPSC Prelims and Mains roadmap.</p>
                <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb-separator"><ChevronRight size={12} /></span>
                    <span className="breadcrumb-current">Syllabus</span>
                </div>
            </div>

            <div className="syllabus-container">
                <div className="tabs">
                    <button className={`tab-btn ${activeTab === 'prelims' ? 'active' : ''}`} onClick={() => setActiveTab('prelims')}>Prelims</button>
                    <button className={`tab-btn ${activeTab === 'mains' ? 'active' : ''}`} onClick={() => setActiveTab('mains')}>Mains</button>
                </div>

                <div className="syllabus-accordion">
                    {syllabusData[activeTab].map((topic) => (
                        <div key={topic.id} className="accordion-item">
                            <div className="accordion-header" onClick={() => toggleTopic(topic.id)}>
                                <h3>{topic.title}</h3>
                                {expandedTopics[topic.id] ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            <AnimatePresence>
                                {expandedTopics[topic.id] && (
                                    <motion.div
                                        className="accordion-content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ul>
                                            {topic.subTopics.map((sub, idx) => (
                                                <li key={idx}>
                                                    <Book size={14} className="accent-text" /> {sub}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Syllabus
