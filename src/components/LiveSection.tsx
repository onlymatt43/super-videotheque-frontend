import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { apiClient } from '../api/client';

const HLS_URL = import.meta.env.VITE_LIVE_HLS_URL ?? 'https://meet.onlymatt.ca/hls/test.m3u8';
const LIVE_STATUS_ENDPOINT = '/api/live';
const CHECK_INTERVAL = 3000;

interface LiveSectionProps {
  fallbackSrc?: string;
}

const LiveSection = ({ fallbackSrc }: LiveSectionProps) => {
  const [isLive, setIsLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

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

  return (
    <section className="relative overflow-hidden rounded-3xl bg-black/50 backdrop-blur-sm border border-white/10">

      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10">
        {isLive ? (
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-white font-semibold text-sm uppercase tracking-wider">En direct</span>
          </div>
        ) : (
          <span className="text-slate-400 text-sm">Pas de live en cours</span>
        )}
      </div>

      {/* Zone vidéo */}
      <div className="relative aspect-video w-full bg-black">

        {/* Stream HLS */}
        <div className={`absolute inset-0 ${isLive ? 'block' : 'hidden'}`}>
          <video
            ref={videoRef}
            playsInline
            className="h-full w-full"
          />
        </div>

        {/* Fallback */}
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
                playsInline
                autoPlay
                loop
                muted
                className="h-full w-full object-cover"
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

    </section>
  );
};

export default LiveSection;
