import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export const VideoPlayer = ({ src, title, onStart, onEnd }: VideoPlayerProps) => {
  const isBunnyEmbed = src.includes('iframe.mediadelivery.net');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isBunnyEmbed) return;
    const handler = (event: MessageEvent) => {
      const origin = typeof event.origin === 'string' ? event.origin : '';
      if (!origin.includes('mediadelivery.net')) return;
      const data: any = event.data;
      const ev = data?.event || data?.type;
      if (!ev) return;
      if ((ev === 'play' || ev === 'playing') && !startedRef.current) {
        startedRef.current = true;
        onStart?.();
      }
      if (ev === 'ended') {
        onEnd?.();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [isBunnyEmbed, onStart, onEnd]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black">
      {isBunnyEmbed ? (
        <iframe
          ref={iframeRef}
          src={src}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          src={src}
          controls
          playsInline
          className="h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=60"
          onPlay={() => { if (!startedRef.current) { startedRef.current = true; onStart?.(); } }}
          onEnded={() => onEnd?.()}
        >
          Votre navigateur ne supporte pas la lecture vidéo HTML5.
        </video>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 text-white">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xs text-slate">Lecture sécurisée via Bunny.net</p>
      </div>
    </div>
  );
};
