import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

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
        const { data } = await apiClient.post<{ data: { token: string } }>('/api/jitsi/token', {
          rentalId,
          room: roomName,
        });
        if (!aborted) setToken(data.data?.token ?? null);
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