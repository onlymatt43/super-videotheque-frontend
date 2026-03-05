import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import JitsiRoom from './JitsiRoom';

const HLS_URL = 'https://meet.onlymatt.ca/hls/test.m3u8';
const CHECK_INTERVAL = 3000; // vérifier toutes les 3 secondes

interface LiveSectionProps {
  fallbackSrc?: string; // URL vidéo de remplacement quand pas de live
}

const LiveSection = ({ fallbackSrc }: LiveSectionProps) => {
  const [isLive, setIsLive] = useState(false);
  const [showJitsi, setShowJitsi] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Détecter si le stream est actif
  useEffect(() => {
    const checkLive = async () => {
      try {
        const res = await fetch(HLS_URL, { method: 'HEAD', cache: 'no-store' });
        setIsLive(res.ok);
      } catch {
        setIsLive(false);
      }
    };
    checkLive();
    const interval = setInterval(checkLive, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Brancher hls.js quand live
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLive) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls({ 
        lowLatencyMode: true,
        backBufferLength: 0,
        maxLiveSyncPlaybackRate: 1.5,
        liveSyncDurationCount: 2,
        liveMaxLatencyDurationCount: 4,
        initialLiveManifestSize: 1,
      });
      hlsRef.current = hls;
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari — HLS natif
      video.src = HLS_URL;
      video.play().catch(() => {});
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [isLive]);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-black/50 backdrop-blur-sm border border-white/10">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {isLive ? (
            <>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-white font-semibold text-sm uppercase tracking-wider">En direct</span>
            </>
          ) : (
            <span className="text-slate-400 text-sm">Pas de live en cours</span>
          )}
        </div>
        <button
          onClick={() => setShowJitsi(true)}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
        >
          🎥 Rejoindre la salle
        </button>
      </div>

      {/* Zone vidéo */}
      <div className="relative aspect-video w-full bg-black">
        {isLive ? (
          <video
            ref={videoRef}
            controls
            playsInline
            className="h-full w-full"
          />
        ) : fallbackSrc ? (
          fallbackSrc.includes('iframe.mediadelivery.net') || fallbackSrc.includes('youtube') || fallbackSrc.includes('youtu.be') ? (
            <iframe
              src={fallbackSrc}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={fallbackSrc}
              controls
              playsInline
              loop
              className="h-full w-full"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-slate-400">
              <p className="text-5xl mb-4">📡</p>
              <p className="text-base font-medium text-white/60">Pas de live en ce moment</p>
              <p className="text-sm mt-1">Le prochain live sera annoncé prochainement</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Jitsi */}
      {showJitsi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl" style={{ height: '80vh' }}>
            <button
              onClick={() => setShowJitsi(false)}
              className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              ✕
            </button>
            <div className="h-full w-full rounded-2xl overflow-hidden">
              <JitsiRoom roomName="NO ZOOM ROOM" userName="ONLYMATT" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LiveSection;
