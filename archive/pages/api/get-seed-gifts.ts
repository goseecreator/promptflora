import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase-admin'; // assumes you’ve set up lib/firebase-admin.ts
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const snapshot = await db
      .collection('gifts')
      .where('type', '==', 'seed')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const seeds = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ gifts: seeds });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("🔥 FULL FIRESTORE ERROR:", err.stack || err.message);
      res.status(500).json({ error: err.message || 'Failed to fetch seeds' });
    } else {
      console.error("🔥 FULL FIRESTORE ERROR:", err);
      res.status(500).json({ error: 'Failed to fetch seeds' });
    }
  }
  
}
