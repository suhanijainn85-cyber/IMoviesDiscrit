import React, { useState } from 'react';
import { Booking } from '../types';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, AlertCircle, CheckCircle2, Film } from 'lucide-react';
import { StorageService } from '../services/storage';

interface BookingHistoryProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onExploreMovies: () => void;
  onRefreshBookings: () => void;
}

export const BookingHistory: React.FC<BookingHistoryProps> = ({
  bookings,
  onSelectBooking,
  onExploreMovies,
  onRefreshBookings,
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'confirmed') return b.status === 'Confirmed';
    if (filter === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">My Movie Tickets</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Active admissions, past cinema bookings, and cancellation history
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              filter === 'all' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              filter === 'confirmed' ? 'bg-rose-600 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              filter === 'cancelled' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No tickets found in this tab</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Explore now showing movies across District theatres and reserve prime seats.
          </p>
          <button
            onClick={onExploreMovies}
            className="mt-2 px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm"
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isCancelled = booking.status === 'Cancelled';

            return (
              <div
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCancelled
                    ? 'bg-neutral-900/40 border-neutral-800/80 opacity-70 hover:opacity-100'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isCancelled ? 'bg-neutral-800 text-neutral-500' : 'bg-rose-600/20 text-rose-400'
                  }`}>
                    <Film className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-neutral-400 font-semibold">{booking.bookingRef}</span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="text-rose-400 font-semibold">{booking.format}</span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        isCancelled ? 'bg-neutral-800 text-neutral-400' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-1">
                      {booking.movieTitle}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1 flex-wrap">
                      <span>{booking.theatreName}</span>
                      <span aria-hidden="true">·</span>
                      <span>Audi {booking.audiNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono font-medium text-white">{booking.seats.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Date, Showtime & Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-800">
                  <div className="text-left md:text-right">
                    <div className="text-xs font-bold text-white font-mono">{booking.showTime}</div>
                    <div className="text-[11px] text-neutral-400">{booking.showDate}</div>
                    <div className="text-xs font-mono text-emerald-400 font-semibold mt-0.5">
                      ${booking.totalPaid.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-400 group-hover:text-white">
                    <span className="hidden sm:inline font-medium">View Pass</span>
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
