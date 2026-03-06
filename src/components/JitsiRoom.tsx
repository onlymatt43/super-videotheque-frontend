import { useEffect, useState } from 'react';

const JITSI_HOST = 'jitsi.onlymatt.ca';

const JitsiRoom = ({ roomName, userName, rentalId }: { roomName: string; userName: string; rentalId?: string }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rentalId) return;
    let aborted = false;
    const fetchToken = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/jitsi/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rentalId, room: roomName }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const json = await res.json();
        if (!aborted) setToken(json.data?.token ?? null);
      } catch (err: any) {
        if (!aborted) setError(err?.message ?? 'Failed to get token');
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    fetchToken();
    return () => {
      aborted = true;
    };
  }, [rentalId, roomName]);

  const src = token
    ? `https://${JITSI_HOST}/${encodeURIComponent(roomName)}?jwt=${encodeURIComponent(token)}`
    : `https://${JITSI_HOST}/${encodeURIComponent(roomName)}`;

  return (
    <div style={{ height: '800px', width: '100%' }} data-user={userName}>
      {loading && <div>Chargement de la session...</div>}
      {error && <div style={{ color: 'red' }}>Erreur: {error}</div>}
      <iframe
        title={`jitsi-${roomName}`}
        src={src}
        allow="camera; microphone; fullscreen; display-capture"
        style={{ width: '100%', height: '100%', border: '0' }}
      />
    </div>
  );
};

export default JitsiRoom;