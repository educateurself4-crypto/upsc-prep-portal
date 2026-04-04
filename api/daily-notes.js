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
        const collection = db.collection('daily-notes');

        const today = new Date().toDateString();

        // 1. Check if we already have today's notes in DB
        const existingData = await collection.findOne({ fetchDate: today });
        if (existingData) {
            console.log("Serving daily notes from MongoDB Cache");
            return res.status(200).json(existingData.data);
        }

        // 2. Not found in DB, fetch from n8n
        console.log("Fetching new daily notes from n8n...");
        const N8N_CA_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/get-upsc-content';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(N8N_CA_WEBHOOK_URL, { signal: controller.signal }).catch(() => null);
        clearTimeout(timeoutId);

        if (!response || !response.ok) {
            return res.status(500).json({ error: 'Failed to fetch notes from n8n' });
        }

        const data = await response.json();

        // 3. Save to MongoDB
        await collection.insertOne({
            fetchDate: today,
            data: data,
            createdAt: new Date()
        });
        
        console.log("Stored new daily notes to MongoDB successfully");
        return res.status(200).json(data);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
