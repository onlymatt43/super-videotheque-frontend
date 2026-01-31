import type { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface CarouselProps {
  title: string;
  movies: Movie[];
  onWatch: (movie: Movie) => void;
}

export const Carousel = ({ title, movies, onWatch }: CarouselProps) => (
  <section className="mb-8 sm:mb-10">
    <div className="mb-3 sm:mb-4 flex items-center justify-between">
      <h2 className="font-display text-xl sm:text-3xl uppercase tracking-[0.15em] sm:tracking-[0.3em] text-white">{title}</h2>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate">Swipe →</span>
    </div>
    <div className="scroll-mask -mx-3 flex gap-3 sm:gap-6 overflow-x-auto px-3 pb-4">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} onWatch={() => onWatch(movie)} />
      ))}
    </div>
  </section>
);
