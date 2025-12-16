interface VideoPlayerProps {
  src: string;
  title: string;
}

export const VideoPlayer = ({ src, title }: VideoPlayerProps) => {
  // Check if it's a Bunny embed URL (iframe) or direct video URL
  const isBunnyEmbed = src.includes('iframe.mediadelivery.net');

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black">
      {isBunnyEmbed ? (
        <iframe
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
