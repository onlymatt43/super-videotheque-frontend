import { useEffect, useState, useRef } from 'react';
import { Play } from 'lucide-react';
import type { Movie } from '../types';
import { useCatalog } from '../features/catalog/useCatalog';
import { usePreviewTrigger } from '../hooks/usePreviewTrigger';
import { PreviewPlayer } from './PreviewPlayer';
import clsx from 'clsx';

interface Props {
  movie: Movie;
  onWatch: () => void;
}

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=60';
const FALLBACK_PREVIEW = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

type AspectRatio = 'vertical' | 'horizontal' | 'square';

// Random timing for title flicker effect
const getRandomDelay = () => Math.random() * 3000 + 2000; // 2-5 seconds
const getRandomDuration = () => Math.random() * 2000 + 1000; // 1-3 seconds visible

export const MovieCard = ({ movie, onWatch }: Props) => {
  const previewingId = useCatalog((state) => state.previewingId);
  const setPreviewing = useCatalog((state) => state.setPreviewing);
  const { ref, shouldPreview } = usePreviewTrigger(4000);
  const isActive = previewingId === movie._id;
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('vertical');
  const [showTitle, setShowTitle] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldPreview && !isActive) {
      setPreviewing(movie._id);
    } else if (!shouldPreview && isActive) {
      setPreviewing(null);
    }
  }, [shouldPreview]);

  // Detect image aspect ratio
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      if (ratio > 1.2) {
        setAspectRatio('horizontal');
      } else if (ratio < 0.8) {
        setAspectRatio('vertical');
      } else {
        setAspectRatio('square');
      }
    };
    img.src = movie.thumbnailUrl || FALLBACK_POSTER;
  }, [movie.thumbnailUrl]);

  // Flickering title effect with random timing
  useEffect(() => {
    const flicker = () => {
      setShowTitle(true);
      timeoutRef.current = setTimeout(() => {
        setShowTitle(false);
        timeoutRef.current = setTimeout(flicker, getRandomDelay());
      }, getRandomDuration());
    };

    // Start with random initial delay
    timeoutRef.current = setTimeout(flicker, Math.random() * 4000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const poster = movie.thumbnailUrl || FALLBACK_POSTER;
  const previewSource = movie.previewUrl || FALLBACK_PREVIEW;

  // Dynamic sizing based on aspect ratio
  const sizeClasses = {
    vertical: 'h-72 w-44',
    horizontal: 'h-44 w-72',
    square: 'h-56 w-56'
  };

  return (
    <article
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        'group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-night-light poster-shadow transition-all duration-300 hover:-translate-y-1',
        sizeClasses[aspectRatio],
        isActive && 'ring-2 ring-ember'
      )}
    >
      <img src={poster} alt={movie.title} className="h-full w-full object-cover" loading="lazy" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60" />
      
      {/* Flickering title */}
      <div className={clsx(
        'absolute inset-x-0 bottom-0 p-4 transition-opacity',
        showTitle ? 'opacity-100 duration-300' : 'opacity-0 duration-700'
      )}>
        <p className="text-sm font-bold uppercase tracking-wider text-ember drop-shadow-lg line-clamp-1">
          {movie.title}
        </p>
      </div>
      
      {/* Play button - visible on hover only */}
      <div className={clsx(
        'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
        isHovered ? 'opacity-100' : 'opacity-0'
      )}>
        <button
          type="button"
          onClick={onWatch}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-ember text-night shadow-glow transition-transform hover:scale-110"
        >
          <Play size={24} fill="currentColor" />
        </button>
      </div>
      
      <PreviewPlayer active={isActive} src={previewSource} />
    </article>
  );
};
