import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SeedGift() {
  const [bolt11, setBolt11] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState('');
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const pollLineageStatus = (lineage: string) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetch('/api/check-lineage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invoice: lineage })
          });
          const data = await res.json();
          if (data.settled) {
            clearInterval(interval);
            setPaid(true);
          }
        } catch (err) {
          console.error('Error checking lineage status', err);
        }
      }, 5000);
    };

    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/generate-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountSats: 1000, memo: 'Seed Gift 🌱' })
        });
        const data = await res.json();
        if (data.invoice) {
          setBolt11(data.invoice);
          pollLineageStatus(data.invoice);
        } else {
          throw new Error('No invoice returned');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to generate invoice');
        } else {
          setError('Failed to generate invoice');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();

    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('muun')) setWallet('muun');
    else if (userAgent.includes('phoenix')) setWallet('phoenix');
    else if (userAgent.includes('breez')) setWallet('breez');
    else if (userAgent.includes('alby')) setWallet('alby');
  }, []);

  return (
    <Card className="p-4 max-w-md mx-auto mt-10 text-center">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">🌱 Offer a Sacred Seed</h2>
        {loading ? (
          <p>Generating Lightning invoice...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : paid ? (
          <div className="text-green-700 bg-green-100 p-4 rounded">
            🌱 Your Seed has been planted. Blessings ripple forth.
          </div>
        ) : (
          <>
            <QRCode value={bolt11} size={200} />
            <div className="mt-4">
              <p className="text-sm">💡 Trouble scanning? Copy this into your wallet:</p>
              <textarea
                className="w-full mt-2 p-2 border rounded"
                value={bolt11}
                readOnly
                onClick={(e) => e.currentTarget.select()}
              />
              {wallet === 'muun' && (
                <div className="mt-4 text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
                  🚨 <strong>Muun Wallet users:</strong> Muun does not support receiving Lightning directly.
                  Please use a Lightning-compatible wallet like <em>Phoenix</em>, <em>Breez</em>, or <em>Alby</em> to scan this invoice.
                </div>
              )}
            </div>
          </>
        )}
        <Button className="mt-6">Back to Portal</Button>
      </CardContent>
    </Card>
  );
}
