import React from 'react';
import { Theatre, Movie } from '../types';
import { MapPin, Navigation, Sparkles, Film, Ticket, Check } from 'lucide-react';

interface TheatresViewProps {
  theatres: Theatre[];
  movies: Movie[];
  selectedDistrict: string;
  onSelectDistrict: (dist: string) => void;
  onSelectMovieForBooking: (movie: Movie) => void;
}

export const TheatresView: React.FC<TheatresViewProps> = ({
  theatres,
  movies,
  selectedDistrict,
  onSelectDistrict,
  onSelectMovieForBooking,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          District Cinema Directory
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Explore world-class IMAX screens, VIP lounge auditoriums, and 4DX immersive venues
        </p>
      </div>

      {/* Theatres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {theatres.map((theatre) => (
          <div
            key={theatre.id}
            className="p-6 bg-neutral-900/70 border border-neutral-800 rounded-2xl space-y-4 hover:border-neutral-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{theatre.district}</span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className="text-neutral-400 font-mono">{theatre.distanceKm} km away</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{theatre.name}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{theatre.address}</p>
                </div>
              </div>

              {/* Formats Available */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {theatre.formatsAvailable.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 text-[10px] font-mono font-semibold text-neutral-200 bg-neutral-950 border border-neutral-700/80 rounded"
                  >
                    {fmt}
                  </span>
                ))}
              </div>

              {/* Amenities List */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-1.5">
                <span className="text-[11px] text-neutral-500 uppercase font-medium tracking-wider block">
                  Auditorium Features
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300">
                  {theatre.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-1.5 text-[11px]">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Currently Playing Highlights in this Cinema */}
            <div className="mt-4 pt-3 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-400 block mb-2 font-medium">
                Now Playing at {theatre.name.split(' ')[0]}:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {movies.slice(0, 3).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelectMovieForBooking(m)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-rose-500/60 rounded-lg text-xs text-white whitespace-nowrap transition-colors"
                  >
                    <Film className="w-3 h-3 text-rose-400" />
                    <span>{m.title.split(':')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
