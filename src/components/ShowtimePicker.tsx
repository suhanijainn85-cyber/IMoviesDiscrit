import React, { useState } from 'react';
import { Movie, Theatre, ShowTime } from '../types';
import { ArrowLeft, Calendar, MapPin, Sparkles, Clock, Info } from 'lucide-react';

interface ShowtimePickerProps {
  movie: Movie;
  theatres: Theatre[];
  selectedDistrict: string;
  onBack: () => void;
  onSelectShowtime: (show: ShowTime, theatre: Theatre) => void;
  generateShows: (movies: Movie[], theatres: Theatre[], date: string) => ShowTime[];
}

export const ShowtimePicker: React.FC<ShowtimePickerProps> = ({
  movie,
  theatres,
  selectedDistrict,
  onBack,
  onSelectShowtime,
  generateShows,
}) => {
  // Generate upcoming 6 dates
  const dates = React.useMemo(() => {
    const list = [];
    const baseDate = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      list.push({ iso, dayName, monthDay });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(dates[0].iso);

  // Generate showtimes for the selected date
  const showsForDate = React.useMemo(() => {
    return generateShows([movie], theatres, selectedDate);
  }, [movie, theatres, selectedDate, generateShows]);

  // Filter theatres for the selected district, or include all if few
  const relevantTheatres = theatres.filter(
    (t) => t.district === selectedDistrict || theatres.length <= 2
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Breadcrumb & Movie Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
            title="Back to movies"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="font-mono text-[11px] font-bold text-neutral-200 bg-neutral-800 px-1.5 py-0.5 rounded">
                {movie.certificate}
              </span>
              <span>{movie.genres.join(' / ')}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{movie.durationMinutes} mins</span>
              <span aria-hidden="true">·</span>
              <span>{movie.languages.join(', ')}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
              {movie.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>District: <strong className="text-white font-medium">{selectedDistrict}</strong></span>
        </div>
      </div>

      {/* Date Picker Strip */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-rose-500" />
          <span>Select Date</span>
        </div>
        
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
          {dates.map((d) => (
            <button
              key={d.iso}
              onClick={() => setSelectedDate(d.iso)}
              className={`flex flex-col items-center justify-center min-w-[84px] py-2.5 px-3 rounded-xl border transition-all ${
                selectedDate === d.iso
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950/40'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <span className="text-[11px] font-medium uppercase tracking-wider">
                {d.dayName}
              </span>
              <span className="text-sm font-bold font-mono tabular-nums mt-0.5">
                {d.monthDay}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Theatres & Showtimes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Available Auditoriums</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Available</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Filling Fast</span>
            </span>
          </div>
        </div>

        {relevantTheatres.length === 0 ? (
          <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-xl">
            <p className="text-sm text-neutral-300">No scheduled shows in {selectedDistrict} for this date.</p>
            <p className="text-xs text-neutral-500 mt-1">Check nearby districts or other dates above.</p>
          </div>
        ) : (
          relevantTheatres.map((theatre) => {
            const theatreShows = showsForDate.filter((s) => s.theatreId === theatre.id);
            return (
              <div
                key={theatre.id}
                className="p-5 bg-neutral-900/60 border border-neutral-800/80 rounded-xl space-y-4 hover:border-neutral-700/80 transition-colors"
              >
                {/* Theatre Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{theatre.name}</span>
                      <span className="text-[11px] font-mono text-neutral-400 font-normal">
                        · {theatre.distanceKm} km away
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{theatre.address}</p>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {theatre.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="text-[10px] text-neutral-300 bg-neutral-950/80 border border-neutral-800 px-2 py-0.5 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div>
                  <div className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider mb-2">
                    Showtimes & Screen Formats
                  </div>

                  {theatreShows.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic">No showtimes available for this date.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {theatreShows.map((show) => {
                        const occupiedPercent = Math.round((show.seatsOccupied.length / 84) * 100);
                        const isFilling = occupiedPercent > 45;

                        return (
                          <button
                            key={show.id}
                            onClick={() => onSelectShowtime(show, theatre)}
                            className="group flex flex-col p-3 bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 hover:border-rose-500/60 rounded-xl text-left transition-all focus:outline-none"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold font-mono tabular-nums text-white group-hover:text-rose-400 transition-colors">
                                {show.time}
                              </span>
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isFilling ? 'bg-amber-400' : 'bg-emerald-400'
                                }`}
                              />
                            </div>

                            <div className="mt-1 flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-rose-400">{show.format}</span>
                              <span className="text-neutral-500 font-mono">Audi {show.audiNumber}</span>
                            </div>

                            <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                              <span>From ${show.pricing.Executive}</span>
                              <span>{84 - show.seatsOccupied.length} left</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Theatre info notice */}
                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>Free cancellation permitted up to 4 hours before showtime. Instant refund to SkillWallet or card.</span>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
