import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { invoice, type, wallet, timestamp } = req.body;

  if (!invoice || !type || !timestamp) {
    return res.status(400).json({ error: 'Missing required gift data' });
  }

  try {
    await db.collection('gifts').add({
      invoice,
      type,
      wallet: wallet || 'unknown',
      timestamp: new Date(timestamp),
    });

    res.status(200).json({ status: 'Gift logged' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error logging seed gift:', err);
    res.status(500).json({ error: err.message || 'Failed to log seed gift' });
  }
  
}
