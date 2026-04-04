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

        const today = new Date().toDateString();

        // 1. Check if we already have today's quiz in DB (and ensure it's not empty)
        const existingData = await collection.findOne({ fetchDate: today });
        if (existingData && (existingData.data.ca_quizzes?.length > 0 || existingData.data.static_quizzes?.length > 0)) {
            console.log("Serving daily quiz from MongoDB Cache");
            return res.status(200).json(existingData.data);
        }

        // 2. Not found in DB, fetch from our n8n instances
        console.log("Fetching new daily quiz from n8n...");
        const N8N_MOCK_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/get-upsc-content';
        const N8N_STATIC_QUIZ_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/get-static-quiz';

        // Abort controller strategy to prevent Vercel Serverless Function Timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout since vercel limits to 10s on hobby

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
            return res.status(500).json({ error: 'Failed to fetch any quiz data from n8n' });
        }

        // 3. Save to MongoDB
        await collection.updateOne(
            { fetchDate: today },
            { $set: { data: combinedData, createdAt: new Date() } },
            { upsert: true }
        );

        console.log("Stored new daily quiz to MongoDB successfully");
        return res.status(200).json(combinedData);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
