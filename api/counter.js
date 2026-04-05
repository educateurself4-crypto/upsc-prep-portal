import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const dbClient = await clientPromise;
        const db = dbClient.db('upsc-portal');
        const collection = db.collection('analytics');

        const action = req.query.action; // e.g., ?action=up

        if (action === 'up') {
            await collection.updateOne(
                { _id: 'visitor-stats' },
                { $inc: { count: 1 } },
                { upsert: true }
            );
        }

        const doc = await collection.findOne({ _id: 'visitor-stats' });
        // Start counting from exactly where counterapi.dev left off + your 12,000 base
        // Actually, we'll just handle the 12,000 addition on the frontend as before. 
        // We will seed the database with current counter value if it is completely fresh.
        let actualCount = doc?.count || 130; 
        
        return res.status(200).json({ count: actualCount });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Database error', count: 130 });
    }
}
