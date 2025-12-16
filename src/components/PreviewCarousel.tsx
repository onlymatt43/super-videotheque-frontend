import { useEffect, useState, useRef } from 'react';
import { fetchPublicPreviews, type PublicPreview } from '../api/movies';
import { PreviewPlayer } from './PreviewPlayer';
import clsx from 'clsx';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=60';

interface PreviewCardProps {
  preview: PublicPreview;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const PreviewCard = ({ preview, isActive, onHover, onLeave }: PreviewCardProps) => {
  const [showTitle, setShowTitle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      // Show title after 5 seconds of hovering
      timerRef.current = setTimeout(() => {
        setShowTitle(true);
      }, 5000);
    } else {
      // Reset when mouse leaves
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setShowTitle(false);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive]);

  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onHover}
      onTouchEnd={onLeave}
      className={clsx(
        'relative aspect-square w-36 sm:w-44 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl bg-night-light poster-shadow transition-all duration-300',
        isActive ? 'scale-105 ring-2 ring-ember' : ''
      )}
    >
      <img src={preview.thumbnailUrl || FALLBACK_POSTER} alt={preview.title} className="h-full w-full object-cover" loading="lazy" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-70" />

      {/* Title - appears after 5 seconds */}
      <div className={clsx(
        'absolute inset-x-0 bottom-0 p-3 transition-opacity duration-500',
        showTitle ? 'opacity-100' : 'opacity-0'
      )}>
        <p className="text-sm font-semibold text-white line-clamp-1">{preview.title}</p>
      </div>

      {/* Preview video */}
      <PreviewPlayer active={isActive} src={preview.previewUrl} />
    </article>
  );
};

export const PreviewCarousel = () => {
  const [previews, setPreviews] = useState<PublicPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const loadPreviews = async () => {
      try {
        const data = await fetchPublicPreviews();
        setPreviews(data);
      } catch (err) {
        console.error('Failed to load public previews:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPreviews();
  }, []);

  if (loading) {
    return (
      <section className="mt-10 sm:mt-16">
        <div className="-mx-3 flex gap-3 sm:gap-4 overflow-x-auto px-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-square w-36 sm:w-44 flex-shrink-0 animate-pulse rounded-xl sm:rounded-2xl bg-night-light" />
          ))}
        </div>
      </section>
    );
  }

  if (!previews.length) return null;

  return (
    <section className="mt-10 sm:mt-16">
      <div className="scroll-mask -mx-3 flex gap-3 sm:gap-5 overflow-x-auto px-3 pb-4">
        {previews.map((preview) => (
          <PreviewCard
            key={preview.id}
            preview={preview}
            isActive={activeId === preview.id}
            onHover={() => setActiveId(preview.id)}
            onLeave={() => setActiveId(null)}
          />
        ))}
      </div>
    </section>
  );
};
