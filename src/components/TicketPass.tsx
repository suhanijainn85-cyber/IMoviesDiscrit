import React, { useState } from 'react';
import { Booking } from '../types';
import { QrCode, CheckCircle2, Download, Share2, AlertCircle, ArrowLeft, Armchair, Film, Calendar, Clock, MapPin, Printer } from 'lucide-react';
import { StorageService } from '../services/storage';

interface TicketPassProps {
  booking: Booking;
  onBackToMovies: () => void;
  onBookingCancelled?: () => void;
}

export const TicketPass: React.FC<TicketPassProps> = ({
  booking,
  onBackToMovies,
  onBookingCancelled,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = () => {
    const res = StorageService.cancelBooking(booking.id);
    setCancelFeedback(res);
    if (res.success && onBookingCancelled) {
      setTimeout(() => {
        onBookingCancelled();
      }, 1500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={onBackToMovies}
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cinemas</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
          
          <button
            onClick={handleCopyRef}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Ref!' : 'Share Pass'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Banner */}
      <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Tickets Confirmed & Ready</h4>
          <p className="text-xs text-emerald-300/80 mt-0.5">
            Your booking reference is <strong className="font-mono text-white">{booking.bookingRef}</strong>. Present this pass at Audi {booking.audiNumber}.
          </p>
        </div>
      </div>

      {/* Modern Cinema Pass Card */}
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Pass Top Banner */}
        <div className="p-6 bg-gradient-to-br from-rose-950/60 via-neutral-900 to-neutral-950 border-b border-dashed border-neutral-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider">
                <Film className="w-3.5 h-3.5" />
                <span>District Cinema Admission</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{booking.format}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight mt-1">
                {booking.movieTitle}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {booking.theatreName}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="font-mono text-[11px] text-neutral-500 uppercase block">Audi No.</span>
              <span className="font-mono text-2xl font-black text-rose-500">
                0{booking.audiNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Notched perforated line visual */}
        <div className="relative flex items-center justify-between px-2 -my-3 z-10 pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-[#090a0f] border-r border-neutral-700/80" />
          <div className="flex-1 border-b border-dashed border-neutral-700/80 mx-2" />
          <div className="w-6 h-6 rounded-full bg-[#090a0f] border-l border-neutral-700/80" />
        </div>

        {/* Pass Details Body */}
        <div className="p-6 space-y-5 bg-neutral-900/90">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-xl text-center">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Date</span>
              <span className="text-xs font-bold text-white font-mono">{booking.showDate}</span>
            </div>

            <div className="border-x border-neutral-800">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Showtime</span>
              <span className="text-xs font-bold text-rose-400 font-mono">{booking.showTime}</span>
            </div>

            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Seats</span>
              <span className="text-xs font-bold text-white font-mono">{booking.seats.join(', ')}</span>
            </div>
          </div>

          {/* Seat Tier & Guest Info */}
          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <div>
              <span className="block text-[11px] text-neutral-500">Tier & Class</span>
              <span className="font-semibold text-neutral-200">{booking.seatTier}</span>
            </div>

            <div className="text-right">
              <span className="block text-[11px] text-neutral-500">Guest Name</span>
              <span className="font-medium text-neutral-200">{booking.userName}</span>
            </div>
          </div>

          {/* F&B In-Seat Delivery (if ordered) */}
          {booking.snacks.length > 0 && (
            <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-xl space-y-1.5 text-xs">
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                In-Seat Food & Beverages
              </span>
              {booking.snacks.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between text-neutral-300 text-[11px]">
                  <span>{item.imageIcon} {quantity}x {item.name}</span>
                  <span className="text-neutral-500 font-mono">${(item.price * quantity).toFixed(2)}</span>
                </div>
              ))}
              <p className="text-[10px] text-neutral-500 italic pt-1 border-t border-neutral-800">
                Staff will deliver warm concessions directly to seat {booking.seats[0]} prior to opening credits.
              </p>
            </div>
          )}

          {/* QR Code & Barcode Gate Scanner section */}
          <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-white rounded-xl shadow-lg flex items-center justify-center">
              {/* Dynamic QR SVG Pattern */}
              <svg className="w-32 h-32 text-neutral-950" viewBox="0 0 100 100" fill="currentColor">
                {/* Simulated high-density QR grid matrix */}
                <rect x="0" y="0" width="30" height="30" fill="black" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" fill="black" />

                <rect x="70" y="0" width="30" height="30" fill="black" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" fill="black" />

                <rect x="0" y="70" width="30" height="30" fill="black" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" fill="black" />

                <circle cx="50" cy="50" r="14" fill="black" />
                <circle cx="50" cy="50" r="7" fill="white" />

                {/* Data points */}
                <rect x="36" y="10" width="6" height="6" fill="black" />
                <rect x="48" y="14" width="6" height="6" fill="black" />
                <rect x="38" y="72" width="6" height="6" fill="black" />
                <rect x="52" y="80" width="6" height="6" fill="black" />
                <rect x="72" y="42" width="6" height="6" fill="black" />
                <rect x="84" y="58" width="6" height="6" fill="black" />
                <rect x="16" y="46" width="6" height="6" fill="black" />
              </svg>
            </div>

            <div>
              <span className="font-mono text-xs font-bold text-white tracking-widest block">
                {booking.bookingRef}
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">
                Scan for instant gate entry at {booking.theatreDistrict}
              </span>
            </div>

            {/* Barcode Lines */}
            <div className="w-full max-w-xs flex items-center justify-between h-8 px-2 py-1 bg-white/5 rounded border border-neutral-800">
              {[4, 2, 6, 2, 4, 8, 2, 6, 2, 4, 3, 5, 2, 7, 2, 4, 6, 2, 5, 3, 2, 6].map((w, i) => (
                <div key={i} className="bg-neutral-400 h-full" style={{ width: `${w * 1.5}px` }} />
              ))}
            </div>
          </div>

          {/* Total Paid & Payment Method */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-800">
            <span className="text-neutral-500">
              Paid via {booking.paymentMethod}
              {booking.creditsDeducted ? ` (${booking.creditsDeducted} credits)` : ''}
            </span>
            <span className="font-mono font-bold text-white tabular-nums">
              Total: ${booking.totalPaid.toFixed(2)}
            </span>
          </div>

        </div>

        {/* Cancellation Accordion Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-xs">
          {booking.status === 'Cancelled' ? (
            <div className="text-center p-2 text-rose-400 font-semibold bg-rose-950/30 rounded-lg border border-rose-900/50">
              This ticket has been cancelled & refunded.
            </div>
          ) : !showCancelDialog ? (
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 text-[11px]">Plans changed?</span>
              <button
                onClick={() => setShowCancelDialog(true)}
                className="text-xs text-neutral-400 hover:text-rose-400 transition-colors underline underline-offset-4"
              >
                Cancel Booking & Refund
              </button>
            </div>
          ) : (
            <div className="space-y-3 p-3 bg-neutral-900 rounded-xl border border-neutral-700/80">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Confirm Cancellation?</span>
              </div>
              <p className="text-[11px] text-neutral-300">
                Cancelling will release your seats ({booking.seats.join(', ')}) back to the live auditorium. A 90% refund of ${(booking.totalPaid * 0.9).toFixed(2)} will be credited back immediately.
              </p>

              {cancelFeedback && (
                <p className={`text-xs ${cancelFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {cancelFeedback.message}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
                >
                  Yes, Cancel & Refund
                </button>
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Keep Ticket
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
