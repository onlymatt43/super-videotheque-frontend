import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { apiClient } from '../api/client';
import JitsiRoom from './JitsiRoom';

const HLS_URL = import.meta.env.VITE_LIVE_HLS_URL ?? 'https://meet.onlymatt.ca/hls/test.m3u8';
const LIVE_STATUS_ENDPOINT = '/api/live';
const CHECK_INTERVAL = 3000;

interface LiveSectionProps {
  fallbackSrc?: string;
}

const LiveSection = ({ fallbackSrc }: LiveSectionProps) => {
  const [isLive, setIsLive] = useState(false);
  const [showJitsi, setShowJitsi] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [alias, setAlias] = useState('');
  const [pendingAlias, setPendingAlias] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Détecter si le stream est actif avec stabilité (debounce)
  useEffect(() => {
    const successRef = { count: 0 } as { count: number };
    const failRef = { count: 0 } as { count: number };
    const liveRef = { value: isLive } as { value: boolean };

    const setLiveState = (v: boolean) => {
      liveRef.value = v;
      setIsLive(v);
    };

    const MIN_SUCCESS = 2;
    const MIN_FAIL = 3;

    const checkLive = async () => {
      try {
        const res = await apiClient.get<{ live: boolean }>(LIVE_STATUS_ENDPOINT, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.data?.live) {
          successRef.count += 1;
          failRef.count = 0;
        } else {
          failRef.count += 1;
          successRef.count = 0;
        }
      } catch {
        failRef.count += 1;
        successRef.count = 0;
      }

      if (!liveRef.value && successRef.count >= MIN_SUCCESS) setLiveState(true);
      if (liveRef.value && failRef.count >= MIN_FAIL) setLiveState(false);
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
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          hls.stopLoad();
          hls.detachMedia();
          hls.attachMedia(video);
          hls.loadSource(HLS_URL);
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
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

  const handleJoinClick = () => {
    if (alias) {
      // Déjà un alias — rejoindre directement
      setShowJitsi(true);
    } else {
      setShowNamePrompt(true);
    }
  };

  const handleConfirmAlias = () => {
    const name = pendingAlias.trim();
    if (!name) return;
    setAlias(`ONLY ${name}`);
    setShowNamePrompt(false);
    setShowJitsi(true);
  };

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
        <div className="flex items-center gap-2">
          {showJitsi ? (
            <button
              onClick={() => setShowJitsi(false)}
              className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm font-medium transition-all"
            >
              ✕ Quitter la salle
            </button>
          ) : (
            <button
              onClick={handleJoinClick}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
            >
              🎥 Rejoindre la salle
            </button>
          )}
        </div>
      </div>

      {/* Prompt nom */}
      {showNamePrompt && (
        <div className="p-4 border-b border-white/10 bg-white/5">
          <p className="text-white/80 text-sm mb-3">Ton prénom pour la salle :</p>
          <div className="flex gap-2 items-center">
            <span className="text-white/50 text-sm shrink-0">ONLY</span>
            <input
              autoFocus
              type="text"
              value={pendingAlias}
              onChange={(e) => setPendingAlias(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmAlias()}
              placeholder="Mathieu"
              className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none border border-white/20 focus:border-white/50 placeholder:text-white/30"
            />
            <button
              onClick={handleConfirmAlias}
              disabled={!pendingAlias.trim()}
              className="px-4 py-2 rounded-lg bg-ember text-night text-sm font-semibold disabled:opacity-40 transition-all"
            >
              Entrer
            </button>
            <button
              onClick={() => setShowNamePrompt(false)}
              className="px-3 py-2 rounded-lg bg-white/10 text-white/60 text-sm transition-all hover:bg-white/20"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Zone vidéo */}
      <div className="relative aspect-video w-full bg-black">

        {/* Vidéo HLS — toujours dans le DOM, cachée si pas live */}
        <div className={`absolute inset-0 ${isLive ? 'block' : 'hidden'}`}>
          <video
            ref={videoRef}
            playsInline
            className="h-full w-full"
          />
        </div>

        {/* Fallback ou message */}
        {!isLive && (
          fallbackSrc ? (
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
          )
        )}
      </div>

      {/* Salle Jitsi — sous le stream */}
      {showJitsi && (
        <div className="border-t border-white/10">
          <div className="p-3 bg-white/5 flex items-center justify-between">
            <span className="text-white/60 text-xs">Salle interactive — {alias}</span>
            <span className="text-white/40 text-xs">Caméra/micro contrôlés dans la salle</span>
          </div>
          <div style={{ height: '480px' }}>
            <JitsiRoom roomName="onlymatt-live" userName={alias} />
          </div>
        </div>
      )}

    </section>
  );
};

export default LiveSection;
