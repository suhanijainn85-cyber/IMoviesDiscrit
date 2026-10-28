import React, { useState } from 'react';
import { X, Star, Clock, Ticket, Play, Pause, Volume2, VolumeX, Shield, Check } from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onBookTickets: (movie: Movie) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onBookTickets,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'trailer'>('trailer');

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-30 w-8 h-8 rounded-full bg-neutral-950/80 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media / Trailer Header Area */}
        <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
          {activeTab === 'trailer' ? (
            <div className="relative w-full h-full flex flex-col justify-between p-6" style={{ background: movie.posterBg }}>
              {/* Dynamic cinematic animated glow effect */}
              <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 bg-neutral-950/70 px-2.5 py-1 rounded border border-neutral-800">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>OFFICIAL DISTRICT 4K TRAILER</span>
                </div>
              </div>

              {/* Central Trailer Visualizer */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
                <p className="mt-3 text-sm font-semibold text-white drop-shadow">
                  {isPlaying ? 'Playing Official Theatrical Trailer' : 'Trailer Paused'}
                </p>
                <p className="text-xs text-neutral-300/80 font-mono mt-0.5">
                  Dolby Atmos 7.1 · Mastered in 4K DCI
                </p>
              </div>

              {/* Bottom Trailer Controls */}
              <div className="relative z-10 flex items-center justify-between text-xs text-neutral-300 bg-neutral-950/80 backdrop-blur-md px-4 py-2 rounded-lg border border-neutral-800">
                <span className="font-mono tabular-nums text-neutral-400">01:24 / 02:45</span>
                
                {/* Simulated playback scrubber */}
                <div className="flex-1 mx-4 h-1 bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[52%] transition-all"></div>
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full p-6 flex flex-col justify-end" style={{ background: movie.posterBg }}>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white drop-shadow">{movie.title}</h2>
                <p className="text-xs text-neutral-300 italic">{movie.tagline}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('trailer')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'trailer'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Theatrical Trailer
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            About & Cast
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1 flex-wrap">
              <span className="px-2 py-0.5 font-mono text-[11px] font-bold text-neutral-200 bg-neutral-800 rounded border border-neutral-700">
                {movie.certificate}
              </span>
              <span className="font-mono tabular-nums text-neutral-300">
                {Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{movie.genres.join(' / ')}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{movie.languages.join(', ')}</span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">{movie.title}</h2>
            <p className="text-xs text-rose-400 font-medium italic mt-0.5">&ldquo;{movie.tagline}&rdquo;</p>
          </div>

          {/* Ratings & Formats Strip */}
          <div className="flex flex-wrap items-center gap-4 p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <div>
                <div className="text-sm font-bold font-mono tabular-nums text-white">
                  {movie.rating.toFixed(1)} <span className="text-xs text-neutral-500 font-normal">/ 10</span>
                </div>
                <div className="text-[10px] text-neutral-400">
                  {(movie.votesCount / 1000).toFixed(1)}k verified ratings
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-neutral-800 hidden sm:block" />

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-neutral-400 font-medium mr-1">Available in:</span>
              {movie.formats.map((fmt) => (
                <span
                  key={fmt}
                  className="px-2 py-0.5 text-[11px] font-mono font-medium text-neutral-200 bg-neutral-900 border border-neutral-700/80 rounded"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Synopsis
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Director & Cast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
            <div>
              <span className="text-xs text-neutral-500 font-medium block">Director</span>
              <span className="text-xs font-semibold text-neutral-200">{movie.director}</span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 font-medium block">Lead Ensemble</span>
              <span className="text-xs font-medium text-neutral-200">{movie.cast.join(', ')}</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onBookTickets(movie);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-lg shadow-rose-950/40"
            >
              <Ticket className="w-4 h-4" />
              <span>Select Theatres & Showtimes</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
