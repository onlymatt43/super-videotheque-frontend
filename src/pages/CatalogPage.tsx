import { useEffect, useMemo, useState } from 'react';
import { Carousel } from '../components/Carousel';
import { useCatalog } from '../features/catalog/useCatalog';
import { useSession } from '../features/session/useSession';
import type { Movie } from '../types';
import { VideoModal } from '../components/VideoModal';
import { createRental } from '../api/rentals';
import { fetchCategories, type Category } from '../api/categories';
import { AIChat } from '../components/AIChat';
import { AccessManager } from '../components/AccessManager';
import { PayhipForm } from '../components/PayhipForm';
import JitsiRoom from '../components/JitsiRoom';

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCode, setShowAddCode] = useState(false);

  useEffect(() => {
    if (!movies.length) {
      fetchCatalog();
    }
    fetchCategories().then(setCategories).catch(console.error);
  }, [movies.length, fetchCatalog]);

  // Featured movie: random from "soon" category or placeholder
  // const featured = useMemo(() => {
  //   const soonMovies = movies.filter(m => m.category === 'soon');
  //   if (soonMovies.length > 0) {
  //     return soonMovies[Math.floor(Math.random() * soonMovies.length)];
  //   }
  //   // Return placeholder when no "soon" movies exist
  //   return null;
  // }, [movies]);

  // Group movies by category (dynamic) and filter by access
  const moviesByCategory = useMemo(() => {
    const groups: Record<string, { label: string; movies: Movie[] }> = {};
    
    categories.forEach(cat => {
      const catMovies = movies.filter(m => {
        if (m.category !== cat.slug) return false;
        return hasAccess(m._id, m.category);
      });
      if (catMovies.length > 0) {
        groups[cat.slug] = { label: cat.label, movies: catMovies };
      }
    });
    
    return groups;
  }, [movies, categories, hasAccess]);

  // Recent movies (last 10) filtered by access
  const recentMovies = useMemo(() => 
    movies.filter(m => hasAccess(m._id, m.category)).slice(0, 10),
    [movies, hasAccess]
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

      <section className="relative overflow-hidden rounded-3xl bg-black/50 backdrop-blur-sm p-4 border border-white/10" style={{ minHeight: '800px' }}>
        <JitsiRoom roomName="NO ZOOM ROOM" userName="ONLYMATT" />
      </section>

      {loading && <p className="text-center text-slate">Chargement du catalogue...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {/* Nouveautés */}
      {!loading && recentMovies.length > 0 && (
        <Carousel title="Nouveautés" movies={recentMovies} onWatch={handleWatch} />
      )}

      {/* Sections par catégorie */}
      {!loading && Object.entries(moviesByCategory).map(([category, data]) => (
        <Carousel 
          key={category} 
          title={data.label} 
          movies={data.movies} 
          onWatch={handleWatch} 
        />
      ))}

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
