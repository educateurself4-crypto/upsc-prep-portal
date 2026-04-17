import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  // Graceful failure message if env is missing
  console.error('Please add your Mongo URI to .env.local');
} else {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export default async function handler(req, res) {
    if (!uri) {
        return res.status(500).json({ error: 'MONGODB_URI is not set in Vercel environment' });
    }

    try {
        const mongoClient = await clientPromise;
        const db = mongoClient.db('upsc-portal');
        const collection = db.collection('daily-quiz');

        // The n8n workflow updates content at 10 PM IST (16:30 UTC) every day.
        // We want the logical "Day" (fetchDate) to rollover exactly at that time, rather than midnight UTC.
        // Subtracting 16.5 hours from current UTC time ensures the date string changes at exactly 16:30 UTC.
        const getEffectiveDate = () => {
            const now = new Date();
            const offsetMs = 16.5 * 60 * 60 * 1000; 
            return new Date(now.getTime() - offsetMs).toDateString();
        };
        const today = getEffectiveDate();
        const N8N_MOCK_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/get-upsc-content';
        const N8N_STATIC_QUIZ_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/get-static-quiz';

        let todayData = null;

        // 1. Check if we already have today's quiz in DB (and ensure it's not expired)
        const CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache
        const existingData = await collection.findOne({ fetchDate: today });
        
        if (existingData && (existingData.data?.ca_quizzes?.length > 0 || existingData.data?.static_quizzes?.length > 0)) {
            const age = existingData.createdAt ? (new Date() - new Date(existingData.createdAt)) : 0;
            if (existingData.createdAt && age < CACHE_TTL) {
                console.log("Found today's quiz in MongoDB Cache (Valid)");
                todayData = existingData.data;
            } else {
                console.log(`Cache expired (${Math.round(age/1000/60)} mins old). Fetching fresh from n8n...`);
            }
        }

        // 2. Not found in DB or expired, fetch from our n8n instances
        if (!todayData) {
            console.log("No valid cache for today, fetching fresh from n8n webhooks...");
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const [dailyRes, dedicatedStaticRes] = await Promise.all([
                fetch(N8N_MOCK_WEBHOOK_URL, { signal: controller.signal }).catch(() => null),
                fetch(N8N_STATIC_QUIZ_WEBHOOK_URL, { signal: controller.signal }).catch(() => null)
            ]);
            
            clearTimeout(timeoutId);

            let combinedData = {
                ca_quizzes: [],
                static_quizzes: []
            };

            if (dailyRes && dailyRes.ok) {
                const data = await dailyRes.json();
                const rawCA = data.ca_quizzes || (Array.isArray(data) ? data : []);
                combinedData.ca_quizzes = rawCA;
                if (data.static_quizzes) combinedData.static_quizzes = data.static_quizzes;
            }

            if (dedicatedStaticRes && dedicatedStaticRes.ok) {
                const staticData = await dedicatedStaticRes.json();
                let raw = Array.isArray(staticData) ? staticData : (staticData.static_quizzes || (staticData.questions ? [staticData] : []));
                combinedData.static_quizzes = [...combinedData.static_quizzes, ...raw];
            }

            if (combinedData.ca_quizzes.length === 0 && combinedData.static_quizzes.length === 0) {
                if (existingData && existingData.data) {
                    console.log("n8n returned empty/failed. Falling back to stale cache.");
                    todayData = existingData.data;
                } else {
                    return res.status(500).json({ error: 'Failed to fetch any quiz data from n8n' });
                }
            } else {
                // Save to MongoDB
                await collection.updateOne(
                    { fetchDate: today },
                    { $set: { data: combinedData, createdAt: new Date() } },
                    { upsert: true }
                );
                todayData = combinedData;
            }
        }

        console.log("Fetching up to 10 days of historical quizzes from MongoDB");
        const historicalDocs = await collection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
        
        let allCA = [];
        let allStatic = [];
        
        for (const doc of historicalDocs) {
            const docDate = doc.fetchDate ? new Date(doc.fetchDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            
            const docCA = doc.data?.ca_quizzes || [];
            docCA.forEach(q => {
                const standardizedQ = { ...q, date: docDate };
                delete standardizedQ.Date;
                allCA.push(standardizedQ);
            });

            const docStatic = doc.data?.static_quizzes || [];
            docStatic.forEach(q => {
                const standardizedQ = { ...q, date: docDate };
                delete standardizedQ.Date;
                allStatic.push(standardizedQ);
            });
        }

        return res.status(200).json({ ca_quizzes: allCA, static_quizzes: allStatic });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
