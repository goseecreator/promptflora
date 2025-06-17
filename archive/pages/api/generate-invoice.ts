import { NextApiRequest, NextApiResponse } from 'next';

// Example with Alby LNURL-pay via custodial API
type AlbyInvoiceResponse = {
  payment_request: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amountSats, memo } = req.body;
  const amountMsat = amountSats * 1000;

  try {
    const response = await fetch('https://api.getalby.com/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ALBY_API_KEY}`
      },
      body: JSON.stringify({
        amount: amountMsat,
        description: memo || 'Seed Gift 🌱'
      })
    });

    const data: AlbyInvoiceResponse = await response.json();

    if (!data.payment_request) {
      throw new Error('Invalid response from Alby');
    }

    res.status(200).json({ invoice: data.payment_request });
} catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Failed to generate invoice' });
  }
  
}
