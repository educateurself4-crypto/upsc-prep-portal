import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Force scroll to top on every route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // 'instant' makes it feel like a hard page load
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
