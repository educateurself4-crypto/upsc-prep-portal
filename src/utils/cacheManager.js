export const fetchWithCache = async (cacheKey, url) => {
    try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            const { data, fetchDate } = JSON.parse(cachedItem);
            const today = new Date().toDateString();
            
            if (fetchDate === today) {
                console.log(`[Cache Hit] Loading ${cacheKey} from local storage.`);
                return data;
            }
        }

        console.log(`[Cache Miss] Fetching fresh data for ${cacheKey} from ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify({
            data,
            fetchDate: new Date().toDateString()
        }));

        return data;
    } catch (error) {
        console.error(`[cacheManager Error] Failed to fetch ${url}:`, error);
        // Fallback to stale cache if network fails
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            console.log(`[Cache Fallback] Using stale data for ${cacheKey}`);
            return JSON.parse(cachedItem).data;
        }
        return null;
    }
}
