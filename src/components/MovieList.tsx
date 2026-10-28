import React from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { Sparkles, Ticket, Play, Star, Clock } from 'lucide-react';

interface MovieListProps {
  movies: Movie[];
  district: string;
  onSelectMovie: (movie: Movie) => void;
  onBookTickets: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  onResetFilters: () => void;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  district,
  onSelectMovie,
  onBookTickets,
  onWatchTrailer,
  onResetFilters,
}) => {
  const featured = movies.find((m) => m.isTrending) || movies[0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      
      {/* Hero Spotlight Cinema Showcase Banner */}
      {featured && (
        <div 
          className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl transition-all"
          style={{ background: featured.posterBg }}
        >
          {/* Dark scrim gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />

          <div className="relative z-20 p-6 md:p-10 lg:p-12 max-w-2xl flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="flex items-center gap-2 text-xs text-rose-300 font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>District Premiere Spotlight</span>
                <span aria-hidden="true" className="text-neutral-500">·</span>
                <span className="text-neutral-300 font-normal">{featured.formats.join(' / ')}</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {featured.title}
              </h1>

              <p className="mt-2 text-sm text-neutral-300 italic font-light">
                &ldquo;{featured.tagline}&rdquo;
              </p>

              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2.5 text-xs text-neutral-400 mt-3 flex-wrap">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-mono tabular-nums text-white">{featured.rating.toFixed(1)}</span>
                  <span className="text-neutral-500 font-normal">({(featured.votesCount / 1000).toFixed(1)}k)</span>
                </div>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="font-mono tabular-nums text-neutral-300">
                  {Math.floor(featured.durationMinutes / 60)}h {featured.durationMinutes % 60}m
                </span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-neutral-300">{featured.genres.join(', ')}</span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-neutral-300">Dir. {featured.director}</span>
              </div>

              <p className="mt-3 text-xs md:text-sm text-neutral-300/90 line-clamp-2 max-w-xl leading-relaxed">
                {featured.synopsis}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onBookTickets(featured)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-950/40 transition-all focus:outline-none"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Instant Show</span>
              </button>

              <button
                onClick={() => onWatchTrailer(featured)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-200 bg-neutral-900/90 hover:bg-neutral-800 rounded-lg border border-neutral-700 transition-colors focus:outline-none"
              >
                <Play className="w-3.5 h-3.5 text-white" />
                <span>Watch Trailer</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Movies Grid Section */}
      <div>
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cinemas in {district}
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
              <span>Showing {movies.length} blockbuster experiences</span>
              <span aria-hidden="true">·</span>
              <span>Live seat reservations open</span>
            </div>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-xl">
            <p className="text-sm text-neutral-300 font-medium">No movies match your filter criteria.</p>
            <p className="text-xs text-neutral-500 mt-1">Try switching districts or clearing format and genre filters.</p>
            <button
              onClick={onResetFilters}
              className="mt-4 px-4 py-2 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectMovie={onSelectMovie}
                onBookTickets={onBookTickets}
                onWatchTrailer={onWatchTrailer}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
