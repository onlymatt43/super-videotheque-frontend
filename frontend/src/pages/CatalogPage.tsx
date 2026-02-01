import { useEffect, useMemo, useState } from 'react';
import { Carousel } from '../components/Carousel';
import { useCatalog } from '../features/catalog/useCatalog';
import { useSession } from '../features/session/useSession';
import type { Movie } from '../types';
import { VideoModal } from '../components/VideoModal';
import { createRental, fetchRental } from '../api/rentals';
import { fetchCategories, type Category } from '../api/categories';
import { AIChat } from '../components/AIChat';
import { AccessManager } from '../components/AccessManager';
import { PayhipForm } from '../components/PayhipForm';

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
  const { customerEmail, rentals, upsertRental, hasAccess, codes } = useSession();
  const [videoState, setVideoState] = useState<VideoState>(initialState);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCode, setShowAddCode] = useState(false);

  useEffect(() => {
    if (!movies.length) {
      fetchCatalog();
    }
    fetchCategories().then(setCategories).catch(console.error);
  }, [movies.length, fetchCatalog]);

  // Featured movie: random from "soon" category or placeholder
  const featured = useMemo(() => {
    const soonMovies = movies.filter(m => m.category === 'soon');
    if (soonMovies.length > 0) {
      return soonMovies[Math.floor(Math.random() * soonMovies.length)];
    }
    // Return placeholder when no "soon" movies exist
    return null;
  }, [movies]);

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

    const payhipCode = codes[0]?.code; // Utiliser le premier code pour la location

    setVideoState({ open: true, loading: true, movie, signedUrl: undefined, error: undefined });

    try {
      const existing = rentals[movie._id];
      const envelope = existing
        ? await fetchRental(existing.rentalId)
        : await createRental({ movieId: movie._id, customerEmail, payhipCode });

      const signedUrl = envelope.signedUrl ?? existing?.signedUrl;
      if (!signedUrl) {
        throw new Error('Lien sécurisé momentanément indisponible.');
      }

      upsertRental(movie._id, {
        rentalId: envelope.rental._id,
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
      try {
        const existing = rentals[movie._id];
        const hasExistingId = !!existing?.rentalId && existing.rentalId !== 'undefined';

        let envelope;
        if (hasExistingId) {
          try {
            envelope = await fetchRental(existing!.rentalId);
          } catch (_getErr) {
            envelope = await createRental({ movieId: movie._id, customerEmail, payhipCode });
          }
        } else {
          envelope = await createRental({ movieId: movie._id, customerEmail, payhipCode });
        }

        const signedUrl = envelope.signedUrl ?? existing?.signedUrl;
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

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-night to-night-light p-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-ember">SOON</p>
          {featured ? (
            <>
              <h1 className="font-display text-5xl uppercase tracking-[0.2em] text-white">{featured.title}</h1>
              <p className="mt-4 text-slate">{featured.description}</p>
              <button
                type="button"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-ember px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-night shadow-glow transition hover:bg-yellow-400"
                onClick={() => handleWatch(featured)}
              >
                Regarder maintenant
              </button>
            </>
          ) : (
            <>
              <h1 className="font-display text-5xl uppercase tracking-[0.2em] text-white">Bientôt disponible</h1>
              <p className="mt-4 text-slate">De nouvelles vidéos arrivent très prochainement...</p>
            </>
          )}
        </div>
        <img
          src={featured?.thumbnailUrl || '/soon-placeholder.png'}
          alt={featured?.title || 'Coming Soon'}
          className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-50 lg:block"
        />
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
      />
    </div>
  );
};
