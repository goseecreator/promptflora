import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { invoice } = req.body;
  if (!invoice) {
    return res.status(400).json({ error: 'Missing lineage (invoice)' });
  }

  try {
    const response = await fetch('https://api.getalby.com/invoices/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ALBY_API_KEY}`
      },
      body: JSON.stringify({ payment_request: invoice })
    });

    const data = await response.json();
    return res.status(200).json({ settled: data.settled || false });
} catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({ error: err.message || 'Failed to verify lineage' });
  }
  
}
