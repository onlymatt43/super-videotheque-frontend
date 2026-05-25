import { useEffect, useMemo, useState } from 'react';
import { Carousel } from '../components/Carousel';
import { useCatalog } from '../features/catalog/useCatalog';
import { useSession } from '../features/session/useSession';
import type { Movie } from '../types';
import { VideoModal } from '../components/VideoModal';
import { createRental } from '../api/rentals';
import { AIChat } from '../components/AIChat';
import { AccessManager } from '../components/AccessManager';
import { PayhipForm } from '../components/PayhipForm';
import LiveSection from '../components/LiveSection';

const DEFAULT_FALLBACK_URL = 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1';
const FALLBACK_SELECTION_KEY = 'live_fallback_last_url';
const PRIVATE_FALLBACK_API_URL = (import.meta.env.VITE_LIVE_FALLBACK_PRIVATE_API_URL as string | undefined)?.trim();
const PRIVATE_FALLBACK_REFRESH_MINUTES = Number(import.meta.env.VITE_LIVE_FALLBACK_PRIVATE_REFRESH_MINUTES ?? 25);
const PRIVATE_FALLBACK_REFRESH_MS = Number.isFinite(PRIVATE_FALLBACK_REFRESH_MINUTES)
  ? Math.max(1, PRIVATE_FALLBACK_REFRESH_MINUTES) * 60 * 1000
  : 25 * 60 * 1000;

type PrivateFallbackItem = {
  locked?: boolean;
  bunny_urls?: Record<string, string>;
};

const parseFallbackUrls = () => {
  const rawList = import.meta.env.VITE_LIVE_FALLBACK_URLS as string | undefined;
  const rawSingle = import.meta.env.VITE_LIVE_FALLBACK_URL as string | undefined;

  const fromList = rawList
    ? rawList.split(/[\n,;]/).map((value) => value.trim()).filter(Boolean)
    : [];

  const combined = fromList.length > 0 ? fromList : (rawSingle ? [rawSingle.trim()] : []);
  return combined.length > 0 ? combined : [DEFAULT_FALLBACK_URL];
};

const pickRandomFallback = (urls: string[]) => {
  if (urls.length <= 1) return urls[0];

  const lastPicked = sessionStorage.getItem(FALLBACK_SELECTION_KEY);
  const pool = urls.filter((url) => url !== lastPicked);
  const nextPool = pool.length > 0 ? pool : urls;
  const picked = nextPool[Math.floor(Math.random() * nextPool.length)];

  sessionStorage.setItem(FALLBACK_SELECTION_KEY, picked);
  return picked;
};

const pickUrlFromPrivateItem = (item: PrivateFallbackItem): string | null => {
  const urls = item.bunny_urls || {};
  const preferredOrder = ['9x16', '16x9', '1x1', 'preview', 'default'];

  for (const key of preferredOrder) {
    const value = String(urls[key] || '').trim();
    if (value) return value;
  }

  for (const value of Object.values(urls)) {
    const clean = String(value || '').trim();
    if (clean) return clean;
  }

  return null;
};

const normalizeTag = (value: string) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

const formatTagLabel = (tag: string) =>
  tag
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

interface VideoState {
  open: boolean;
  movie?: Movie;
  signedUrl?: string;
  loading: boolean;
  error?: string;
}

const initialState: VideoState = {
  open: false,
  loading: false
};

export const CatalogPage = () => {
  const movies = useCatalog((state) => state.movies);
  const loading = useCatalog((state) => state.loading);
  const error = useCatalog((state) => state.error);
  const fetchCatalog = useCatalog((state) => state.fetchCatalog);
  const { customerEmail, upsertRental, hasAccess, codes } = useSession();
  const [videoState, setVideoState] = useState<VideoState>(initialState);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialView, setChatInitialView] = useState<'chat' | 'survey'>('chat');
  const [prefillMessage, setPrefillMessage] = useState<string | undefined>(undefined);
  const [showAddCode, setShowAddCode] = useState(false);
  const [liveFallbackSrc, setLiveFallbackSrc] = useState<string>(() => pickRandomFallback(parseFallbackUrls()));

  useEffect(() => {
    if (!movies.length) {
      fetchCatalog();
    }
  }, [movies.length, fetchCatalog]);

  useEffect(() => {
    if (!PRIVATE_FALLBACK_API_URL) return;

    let isCancelled = false;

    const loadPrivateFallback = async () => {
      try {
        const response = await fetch(PRIVATE_FALLBACK_API_URL);
        if (!response.ok) return;

        const payload = await response.json();
        const list: PrivateFallbackItem[] = Array.isArray(payload)
          ? payload
          : (Array.isArray(payload?.data) ? payload.data : []);

        if (list.length === 0) return;

        const privateOnly = list.filter((item) => item.locked === true);
        const source = privateOnly.length > 0 ? privateOnly : list;

        const urls = source
          .map(pickUrlFromPrivateItem)
          .filter((value): value is string => Boolean(value));

        if (urls.length === 0 || isCancelled) return;
        setLiveFallbackSrc(pickRandomFallback(urls));
      } catch {
        // Keep existing env fallback on any network/parsing issue.
      }
    };

    loadPrivateFallback();
    const intervalId = window.setInterval(loadPrivateFallback, PRIVATE_FALLBACK_REFRESH_MS);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  // Featured movie: random from "soon" category or placeholder
  // const featured = useMemo(() => {
  //   const soonMovies = movies.filter(m => m.category === 'soon');
  //   if (soonMovies.length > 0) {
  //     return soonMovies[Math.floor(Math.random() * soonMovies.length)];
  //   }
  //   // Return placeholder when no "soon" movies exist
  //   return null;
  // }, [movies]);

  const accessibleMovies = useMemo(
    () => movies.filter((m) => hasAccess(m._id, m.category)),
    [movies, hasAccess]
  );

  // Tags-first grouping for catalog display.
  const moviesByTag = useMemo(() => {
    const groups: Record<string, { label: string; movies: Movie[] }> = {};

    for (const movie of accessibleMovies) {
      const rawTags = Array.isArray(movie.tags) ? movie.tags : [];
      const normalizedTags = [...new Set(rawTags.map(normalizeTag).filter(Boolean))];

      for (const tag of normalizedTags) {
        if (!groups[tag]) {
          groups[tag] = { label: formatTagLabel(tag), movies: [] };
        }
        groups[tag].movies.push(movie);
      }
    }

    return Object.entries(groups)
      .sort(([, a], [, b]) => {
        if (b.movies.length !== a.movies.length) return b.movies.length - a.movies.length;
        return a.label.localeCompare(b.label, 'fr');
      })
      .map(([tag, data]) => ({ tag, ...data }));
  }, [accessibleMovies]);

  const untaggedMovies = useMemo(
    () => accessibleMovies.filter((movie) => !Array.isArray(movie.tags) || movie.tags.length === 0),
    [accessibleMovies]
  );

  // Recent movies (last 10) filtered by access
  const recentMovies = useMemo(() => 
    accessibleMovies.slice(0, 10),
    [accessibleMovies]
  );

  const handleWatch = async (movie: Movie) => {
    if (!hasAccess(movie._id, movie.category)) {
      setVideoState({ open: true, loading: false, movie, error: 'Vous n\'avez pas accès à ce contenu. Ajoutez un code valide.' });
      return;
    }

    if (!customerEmail || codes.length === 0) {
      setVideoState({ open: true, loading: false, movie, error: 'Validez votre code Payhip pour accéder à la vidéo.' });
      return;
    }
    // Choisir le meilleur code actif qui donne accès à ce contenu
    const now = Date.now();
    const eligible = codes.find((c) => {
      if (c.validation?.success !== true) return false;
      const grant = c.grant;
      if (grant.type === 'time' && grant.value === 'all') {
        return !!grant.expiresAt && new Date(grant.expiresAt).getTime() > now;
      }
      if (grant.type === 'film' && grant.value === movie._id) return true;
      if (grant.type === 'category' && grant.value === movie.category) return true;
      return false;
    });

    const payhipCode = eligible?.code;
    if (!payhipCode) {
      setVideoState({ open: true, loading: false, movie, error: 'Ce code a expiré ou ne donne pas accès à ce contenu.' });
      return;
    }

    setVideoState({ open: true, loading: true, movie, signedUrl: undefined, error: undefined });

    try {
      // Always create or reuse rental on the server; it will return a fresh signed URL.
      const envelope = await createRental({ movieId: movie._id, customerEmail, payhipCode });

      const signedUrl = envelope.signedUrl;
      if (!signedUrl) {
        throw new Error('Lien sécurisé momentanément indisponible.');
      }

      const rentalId = (envelope.rental as any).id ?? (envelope.rental as any)._id;
      if (!rentalId) {
        throw new Error('Rental not found');
      }

      upsertRental(movie._id, {
        rentalId,
        signedUrl,
        expiresAt: envelope.rental.expiresAt
      });

      setVideoState((state) => ({ ...state, loading: false, signedUrl }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de charger la vidéo.';
      setVideoState((state) => ({ ...state, loading: false, error: message }));
    }
  };

  return (
    <div className="space-y-12">
      {/* AI Assistant button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed top-6 right-6 z-[100] flex h-12 w-12 items-center justify-center rounded-full transition-all hover:scale-110 shadow-glow"
        title="Assistant AI"
      >
        <img src="/ai-icon.png" alt="AI Assistant" className="h-full w-full rounded-full object-cover" />
      </button>

      {/* Add Code button */}
      <button 
        onClick={() => setShowAddCode(!showAddCode)}
        className="fixed top-6 right-20 z-[100] px-4 py-2 rounded-full bg-ember text-night text-sm font-semibold uppercase tracking-wider transition-all hover:bg-yellow-400 shadow-glow"
        title="Ajouter un code"
      >
        + Code
      </button>

      {/* AI Chat Modal */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialView={chatInitialView} prefillMessage={prefillMessage} />

      {/* Access Manager */}
      <AccessManager />

      {/* Add Code Form */}
      {showAddCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={() => setShowAddCode(false)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              ✕
            </button>
            <PayhipForm />
          </div>
        </div>
      )}

      <LiveSection fallbackSrc={liveFallbackSrc} />

      {loading && <p className="text-center text-slate">Chargement du catalogue...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {/* Nouveautés */}
      {!loading && recentMovies.length > 0 && (
        <Carousel title="Nouveautés" movies={recentMovies} onWatch={handleWatch} />
      )}

      {/* Sections par tag */}
      {!loading && moviesByTag.map(({ tag, label, movies: tagMovies }) => (
        <Carousel 
          key={tag}
          title={label}
          movies={tagMovies}
          onWatch={handleWatch} 
        />
      ))}

      {!loading && untaggedMovies.length > 0 && (
        <Carousel
          title="Sans tag"
          movies={untaggedMovies}
          onWatch={handleWatch}
        />
      )}

      <VideoModal
        open={videoState.open}
        movie={videoState.movie}
        signedUrl={videoState.signedUrl}
        isLoading={videoState.loading}
        error={videoState.error}
        onOpenChange={(open) => (!open ? setVideoState(initialState) : setVideoState((state) => ({ ...state, open })))}
        onStart={() => {
          if (videoState.movie) {
            const m = videoState.movie;
            const meta = `ℹ️ Infos du film\nTitre: ${m.title}\nCatégorie: ${m.category}${m.description ? `\nRésumé: ${m.description}` : ''}`;
            setPrefillMessage(meta);
            setChatInitialView('chat');
            setIsChatOpen(true);
          }
        }}
        onEnd={() => {
          setPrefillMessage(undefined);
          setChatInitialView('survey');
          setIsChatOpen(true);
        }}
      />
    </div>
  );
};
