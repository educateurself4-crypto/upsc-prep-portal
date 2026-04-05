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

        let todayData = null;

        // 1. Check if we already have today's notes in DB
        const existingData = await collection.findOne({ fetchDate: today });
        const hasNotes = existingData && existingData.data && ((existingData.data.notes && existingData.data.notes.length > 0) || (Array.isArray(existingData.data) && existingData.data.length > 0));
        
        if (hasNotes) {
            console.log("Found today's notes in MongoDB Cache");
            todayData = existingData.data;
        }

        // 2. Not found in DB, fetch from n8n webhook
        if (!todayData) {
            console.log("No valid notes cache for today, fetching fresh from n8n...");
            const N8N_NOTES_WEBHOOK_URL = 'https://n8n.srv1012222.hstgr.cloud/webhook/get-upsc-content';
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(N8N_NOTES_WEBHOOK_URL, {
                signal: controller.signal
            }).catch(() => null);
            clearTimeout(timeoutId);

            if (!response || !response.ok) {
                return res.status(response?.status || 500).json({ error: 'Failed to fetch notes from n8n' });
            }

            const data = await response.json();
            
            const isDataEmpty = !data || (data.notes && data.notes.length === 0) || (Array.isArray(data) && data.length === 0);
            if (isDataEmpty) {
                return res.status(500).json({ error: 'N8n returned empty notes data' });
            }

            // Save to MongoDB
            await collection.updateOne(
                { fetchDate: today },
                { $set: { data: data, createdAt: new Date() } },
                { upsert: true }
            );
            todayData = data;
        }
        
        console.log("Fetching up to 10 days of historical notes from MongoDB");
        const historicalDocs = await collection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
        
        let allNotes = [];
        let allStaticNotes = [];
        
        for (const doc of historicalDocs) {
            const docDate = doc.fetchDate ? new Date(doc.fetchDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            const data = doc.data;
            
            if (data?.notes) {
                data.notes.forEach(note => allNotes.push({ ...note, date: docDate, Date: undefined }));
            } else if (Array.isArray(data)) {
                data.forEach(note => allNotes.push({ ...note, date: docDate, Date: undefined }));
            }
            
            if (data?.static_notes) {
                data.static_notes.forEach(note => allStaticNotes.push({ ...note, date: docDate, Date: undefined }));
            }
        }

        return res.status(200).json({ notes: allNotes, static_notes: allStaticNotes });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
