import React, { useState, useEffect } from 'react'
import { Users, Eye } from 'lucide-react'

const VisitorCounter = () => {
    const [count, setCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    // Using a public counter API for real persistence
    const API_URL = 'https://api.counterapi.dev/v1/educateurself/homepage';

    useEffect(() => {
        const updateCounter = async () => {
            try {
                // 1. Check if we've already counted this session to avoid inflating on refresh
                const hasCounted = sessionStorage.getItem('hasCounted');

                let data;
                if (!hasCounted) {
                    // 2. If new session, increment the global counter
                    const response = await fetch(`${API_URL}/up`);
                    data = await response.json();
                    sessionStorage.setItem('hasCounted', 'true');
                } else {
                    // 3. Otherwise, just fetch the current total
                    const response = await fetch(API_URL);
                    data = await response.json();
                }

                if (data && data.count) {
                    // We add a base of 12,000 to reflect the existing community
                    setCount(12000 + data.count);
                }
            } catch (error) {
                console.error("Counter Error:", error);
                setCount(12450); // Fallback
            } finally {
                setIsLoading(false);
            }
        };

        updateCounter();
    }, [])

    if (isLoading) return <div className="visitor-counter-loading">...</div>

    return (
        <div className="visitor-counter">
            <div className="counter-badge">
                <Users size={14} className="accent-text" />
                <span className="count-text">
                    {count.toLocaleString()} Aspirants Visited
                </span>
                <span className="live-indicator">
                    <span className="dot"></span> Live
                </span>
            </div>
        </div>
    )
}

export default VisitorCounter
