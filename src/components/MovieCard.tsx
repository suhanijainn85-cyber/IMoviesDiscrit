import React from 'react';
import { Star, Play, Ticket, Clock, ShieldAlert } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onBookTickets: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onBookTickets,
  onWatchTrailer,
}) => {
  const hours = Math.floor(movie.durationMinutes / 60);
  const mins = movie.durationMinutes % 60;

  return (
    <div className="group flex flex-col bg-neutral-900/60 border border-neutral-800/80 rounded-xl overflow-hidden hover:border-neutral-700/80 hover:shadow-xl hover:shadow-black/40 transition-all duration-200">
      
      {/* Poster Media Box with Styled Cinematic Fallback */}
      <div 
        className="relative w-full aspect-[3/4] overflow-hidden cursor-pointer flex flex-col justify-between p-4"
        style={{ background: movie.posterBg }}
        onClick={() => onSelectMovie(movie)}
      >
        {/* Subtle grid pattern & atmospheric overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent z-10 pointer-events-none" />

        {/* Top Badges / Formats */}
        <div className="relative z-20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-semibold text-neutral-200 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-neutral-700/50">
              {movie.certificate}
            </span>
            {movie.formats.slice(0, 2).map((fmt) => (
              <span key={fmt} className="text-[10px] font-semibold tracking-wider uppercase text-neutral-300 bg-neutral-950/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-neutral-800/80">
                {fmt}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-neutral-700/50 text-amber-400">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="font-mono tabular-nums text-xs font-bold text-white">{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Central visual graphic / Title highlight inside poster */}
        <div className="relative z-20 flex flex-col items-center justify-center my-auto text-center px-2">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-2 group-hover:scale-110 group-hover:bg-rose-600 transition-all shadow-lg">
            <Play className="w-5 h-5 ml-0.5" />
          </div>
          <span className="text-[11px] text-neutral-300/80 font-medium tracking-wider uppercase">Trailer Available</span>
        </div>

        {/* Bottom poster text preview */}
        <div className="relative z-20">
          <p className="text-xs text-neutral-300 line-clamp-1 italic font-light drop-shadow">
            &ldquo;{movie.tagline}&rdquo;
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-neutral-900/80">
        <div>
          {/* Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5 flex-wrap">
            <span>{movie.genres.join(' / ')}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Clock className="w-3 h-3 text-neutral-500" />
              {hours}h {mins}m
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>{movie.languages[0]}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectMovie(movie)}
            className="text-base font-bold text-white hover:text-rose-400 transition-colors cursor-pointer line-clamp-1"
          >
            {movie.title}
          </h3>

          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>
        </div>

        {/* Card Actions */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-2">
          <button
            onClick={() => onBookTickets(movie)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-sm focus:outline-none"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets</span>
          </button>
          
          <button
            onClick={() => onSelectMovie(movie)}
            className="py-2 px-3 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors border border-neutral-700/60 focus:outline-none"
            title="View Details"
          >
            Details
          </button>
        </div>

      </div>

    </div>
  );
};
