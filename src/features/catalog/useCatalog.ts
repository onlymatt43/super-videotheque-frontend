import { create } from 'zustand';
import { fetchMovies } from '../../api/movies';
import type { Movie } from '../../types';

interface CatalogState {
  movies: Movie[];
  loading: boolean;
  error?: string;
  previewingId: string | null;
  initialized: boolean;
  fetchCatalog: () => Promise<void>;
  setPreviewing: (id: string | null) => void;
}

export const useCatalog = create<CatalogState>((set, get) => ({
  movies: [],
  loading: false,
  error: undefined,
  previewingId: null,
  initialized: false,
  fetchCatalog: async () => {
    if (get().loading) return;
    set({ loading: true, error: undefined });
    try {
      const movies = await fetchMovies();
      set({ movies, initialized: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load catalog';
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  setPreviewing: (id: string | null) => set({ previewingId: id })
}));
