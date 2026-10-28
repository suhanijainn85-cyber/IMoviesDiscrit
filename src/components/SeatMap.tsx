import React, { useState, useEffect } from 'react';
import { Movie, Theatre, ShowTime, SeatTier, Seat } from '../types';
import { ArrowLeft, Clock, ShieldCheck, Armchair, Accessibility, AlertCircle, ShoppingBag } from 'lucide-react';

interface SeatMapProps {
  movie: Movie;
  theatre: Theatre;
  show: ShowTime;
  onBack: () => void;
  onProceedToFoodOrCheckout: (selectedSeats: Seat[], totalAmount: number) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  movie,
  theatre,
  show,
  onBack,
  onProceedToFoodOrCheckout,
}) => {
  // Hold countdown timer (8 minutes)
  const [secondsRemaining, setSecondsRemaining] = useState(480);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Build auditorium grid
  // Rows: G (Accessible), F (Recliner), E, D, C (VIP), B, A (Executive)
  // Columns: 1 to 12 with central aisle between col 6 and 7
  const rowsConfig: { row: string; tier: SeatTier; price: number; isCouple?: boolean }[] = [
    { row: 'F', tier: 'Recliner', price: show.pricing.Recliner || 28, isCouple: true },
    { row: 'E', tier: 'VIP Club', price: show.pricing['VIP Club'] || 19 },
    { row: 'D', tier: 'VIP Club', price: show.pricing['VIP Club'] || 19 },
    { row: 'C', tier: 'VIP Club', price: show.pricing['VIP Club'] || 19 },
    { row: 'B', tier: 'Executive', price: show.pricing.Executive || 14 },
    { row: 'A', tier: 'Executive', price: show.pricing.Executive || 14 },
    { row: 'G', tier: 'Accessible', price: show.pricing.Accessible || 14 },
  ];

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'reserved' || seat.status === 'locked') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 8) {
        alert('You can select a maximum of 8 seats per booking.');
        return;
      }
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  // Calculate selected seats list & total price
  const selectedSeatsList: Seat[] = [];
  let totalTicketAmount = 0;

  rowsConfig.forEach(({ row, tier, price }) => {
    for (let col = 1; col <= 12; col++) {
      const seatId = `${row}-${col}`;
      if (selectedSeatIds.includes(seatId)) {
        const s: Seat = {
          id: seatId,
          row,
          number: col,
          tier,
          price,
          status: 'selected',
        };
        selectedSeatsList.push(s);
        totalTicketAmount += price;
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="font-semibold text-rose-400">{show.format}</span>
              <span aria-hidden="true">·</span>
              <span>Audi {show.audiNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-white font-medium">{show.time}</span>
              <span aria-hidden="true">·</span>
              <span>{show.date}</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {movie.title}
            </h1>
            <p className="text-xs text-neutral-400">{theatre.name} ({theatre.district})</p>
          </div>
        </div>

        {/* Live Reservation Hold Countdown */}
        <div className="flex items-center gap-3 bg-neutral-900/90 border border-neutral-700/80 px-3.5 py-2 rounded-xl text-xs">
          <Clock className="w-4 h-4 text-rose-500 animate-pulse" />
          <div>
            <span className="text-neutral-400 block text-[11px]">Seat Hold Timer</span>
            <span className="font-mono tabular-nums text-sm font-bold text-white">
              {formatTime(secondsRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Screen & Auditorium Visual Container */}
      <div className="p-6 md:p-8 bg-neutral-950 border border-neutral-800/80 rounded-2xl relative overflow-hidden">
        
        {/* Curved Glowing Projection Screen */}
        <div className="max-w-2xl mx-auto mb-12 text-center cinema-screen-curve">
          <div className="h-2 w-full bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full cinema-screen-arch" />
          <div className="mt-2 text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
            All Eyes This Way · Curved 4K Laser Screen
          </div>
        </div>

        {/* Seating Grid */}
        <div className="max-w-3xl mx-auto space-y-4">
          {rowsConfig.map(({ row, tier, price, isCouple }) => (
            <div key={row} className="flex items-center gap-2 md:gap-4 justify-center">
              
              {/* Row Label */}
              <span className="w-5 font-mono text-xs font-bold text-neutral-400 text-center">
                {row}
              </span>

              {/* Seats Row */}
              <div className="flex items-center gap-1.5 md:gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((col) => {
                  const seatId = `${row}-${col}`;
                  const isReserved = show.seatsOccupied.includes(seatId);
                  const isSelected = selectedSeatIds.includes(seatId);

                  const seatObj: Seat = {
                    id: seatId,
                    row,
                    number: col,
                    tier,
                    price,
                    status: isSelected ? 'selected' : isReserved ? 'reserved' : 'available',
                  };

                  // Aisle spacing after column 6
                  const hasAisle = col === 6;

                  return (
                    <React.Fragment key={seatId}>
                      <button
                        disabled={isReserved}
                        onClick={() => handleSeatClick(seatObj)}
                        onMouseEnter={() => setHoveredSeat(seatObj)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-t-md text-[10px] md:text-xs font-mono font-medium flex items-center justify-center transition-all ${
                          isReserved
                            ? 'bg-neutral-800/50 text-neutral-600 border border-neutral-800 cursor-not-allowed'
                            : isSelected
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/60 scale-105 border border-rose-400 font-bold'
                            : tier === 'Recliner'
                            ? 'bg-amber-950/30 text-amber-300 border border-amber-600/40 hover:bg-amber-600/20 hover:border-amber-400'
                            : tier === 'Accessible'
                            ? 'bg-sky-950/30 text-sky-300 border border-sky-600/40 hover:bg-sky-600/20 hover:border-sky-400'
                            : 'bg-neutral-900 text-neutral-300 border border-neutral-700/60 hover:border-rose-500 hover:text-white'
                        }`}
                        title={`${tier} ${seatId} - $${price}`}
                      >
                        {tier === 'Accessible' && col === 1 ? (
                          <Accessibility className="w-3.5 h-3.5" />
                        ) : (
                          col
                        )}
                      </button>

                      {hasAisle && <div className="w-4 md:w-8" aria-hidden="true" />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <span className="w-5 font-mono text-xs font-bold text-neutral-400 text-center">
                {row}
              </span>
            </div>
          ))}
        </div>

        {/* Hovered Seat Tooltip Preview */}
        <div className="mt-8 text-center min-h-[28px]">
          {hoveredSeat ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 rounded-full font-mono">
              <span className="font-bold text-white">{hoveredSeat.id}</span>
              <span className="text-neutral-500">·</span>
              <span className="text-rose-400">{hoveredSeat.tier}</span>
              <span className="text-neutral-500">·</span>
              <span className="text-emerald-400 font-bold">${hoveredSeat.price}</span>
              <span className="text-neutral-500">·</span>
              <span>{hoveredSeat.status.toUpperCase()}</span>
            </div>
          ) : (
            <span className="text-xs text-neutral-400">
              Hover over any seat to inspect tier & pricing
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-neutral-900 border border-neutral-700"></div>
            <span>Available ($14 - $19)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-rose-600 border border-rose-400 shadow-sm"></div>
            <span className="font-semibold text-rose-300">Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-neutral-800/50 border border-neutral-800"></div>
            <span className="text-neutral-400">Sold / Reserved</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-amber-950/30 border border-amber-600/40 text-amber-400 flex items-center justify-center text-[10px]">
              <Armchair className="w-3 h-3" />
            </div>
            <span>Recliner Pod ($28)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-sky-950/30 border border-sky-600/40 text-sky-400 flex items-center justify-center text-[10px]">
              <Accessibility className="w-3 h-3" />
            </div>
            <span>Accessible ($14)</span>
          </div>
        </div>

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-30 bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {selectedSeatsList.length === 0 ? (
            <div>
              <span className="text-xs text-neutral-400">No seats selected yet</span>
              <p className="text-xs text-neutral-500">Click on your preferred seats above to proceed.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {selectedSeatsList.length} {selectedSeatsList.length === 1 ? 'Seat' : 'Seats'}:
                </span>
                <span className="font-mono text-xs font-bold text-rose-400">
                  {selectedSeatsList.map((s) => s.id).join(', ')}
                </span>
                <span className="text-neutral-500 text-xs">({selectedSeatsList[0].tier})</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums text-base font-extrabold text-white">
                  ${totalTicketAmount}
                </span>
                <span className="text-[11px] text-neutral-500">+ snacks / taxes</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={selectedSeatsList.length === 0}
            onClick={() => onProceedToFoodOrCheckout(selectedSeatsList, totalTicketAmount)}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl transition-all ${
              selectedSeatsList.length === 0
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-800'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue to Food & Checkout (${totalTicketAmount})</span>
          </button>
        </div>
      </div>

    </div>
  );
};
