import React, { useState } from 'react';
import { Movie, Theatre, Booking } from '../types';
import { Plus, ShieldCheck, QrCode, CheckCircle2, XCircle, BarChart3, Film, Armchair, Trash2, RotateCcw } from 'lucide-react';
import { StorageService } from '../services/storage';

interface AdminStudioProps {
  movies: Movie[];
  theatres: Theatre[];
  bookings: Booking[];
  onMovieAdded: (newMovie: Movie) => void;
  onDataReset: () => void;
}

export const AdminStudio: React.FC<AdminStudioProps> = ({
  movies,
  theatres,
  bookings,
  onMovieAdded,
  onDataReset,
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'add_movie' | 'analytics'>('scan');
  
  // Scanner state
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ status: 'valid' | 'invalid' | 'already_used'; booking?: Booking } | null>(null);

  // Add Movie Form state
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [duration, setDuration] = useState('135');
  const [certificate, setCertificate] = useState<'U' | 'U/A' | 'PG-13' | 'R'>('PG-13');
  const [genre, setGenre] = useState('Sci-Fi');
  const [format, setFormat] = useState('IMAX 3D');
  const [director, setDirector] = useState('Christopher Nolan');
  const [feedback, setFeedback] = useState('');

  // Handle Scan Ticket
  const handleVerifyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const query = scanInput.trim().toUpperCase();
    const found = bookings.find((b) => b.bookingRef.toUpperCase() === query || b.id === query);
    
    if (!found) {
      setScanResult({ status: 'invalid' });
    } else if (found.status === 'Cancelled') {
      setScanResult({ status: 'invalid', booking: found });
    } else {
      setScanResult({ status: 'valid', booking: found });
    }
  };

  // Handle Add Movie
  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newMovie: Movie = {
      id: `mov_${Date.now()}`,
      title,
      tagline: tagline || 'An unforgettable cinematic journey.',
      synopsis: synopsis || 'Masterfully crafted feature film presenting groundbreaking visual storytelling.',
      rating: 8.8,
      votesCount: 1200,
      durationMinutes: parseInt(duration) || 120,
      certificate,
      languages: ['English', 'Hindi'],
      formats: [format as any, '2D'],
      genres: [genre as any],
      releaseDate: 'November 2026',
      posterBg: 'linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #e11d48 100%)',
      posterAccent: '#f43f5e',
      director,
      cast: ['Lead Performer', 'Co-Star Ensemble'],
      isTrending: true,
    };

    StorageService.addMovie(newMovie);
    onMovieAdded(newMovie);
    setFeedback(`Movie "${title}" added to District cinema schedule!`);
    setTitle('');
    setTagline('');
    setSynopsis('');
    setTimeout(() => setFeedback(''), 3000);
  };

  // Analytics calculations
  const totalRevenue = bookings.reduce((sum, b) => b.status === 'Confirmed' ? sum + b.totalPaid : sum, 0);
  const totalTicketsSold = bookings.reduce((sum, b) => b.status === 'Confirmed' ? sum + b.seats.length : sum, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span>District Cinema Management Studio</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
            Admin Dashboard & Gate Operations
          </h1>
        </div>

        <button
          onClick={onDataReset}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 hover:text-white transition-colors"
          title="Reset database to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'scan' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Gate Scanner</span>
        </button>
        <button
          onClick={() => setActiveTab('add_movie')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'add_movie' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Movie</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'analytics' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Occupancy & Revenue</span>
        </button>
      </div>

      {/* Tab 1: Gate Scanner */}
      {activeTab === 'scan' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 space-y-4">
            <div className="p-5 bg-neutral-900/70 border border-neutral-800 rounded-xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-rose-500" />
                  <span>Ticket Barcode & QR Code Gate Verifier</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Enter or scan any user Booking Reference ID (e.g. <span className="font-mono text-white">DST-94821</span>) to grant admission into the auditorium.
                </p>
              </div>

              <form onSubmit={handleVerifyTicket} className="flex gap-2">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Enter reference e.g. DST-94821"
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
                >
                  Verify Ticket
                </button>
              </form>

              {/* Quick sample chips to test */}
              <div className="pt-2 border-t border-neutral-800 text-xs">
                <span className="text-[11px] text-neutral-500 block mb-1.5">Quick Test Sample IDs:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {bookings.slice(0, 3).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setScanInput(b.bookingRef)}
                      className="px-2 py-1 bg-neutral-950 border border-neutral-800 hover:border-neutral-600 rounded text-[11px] font-mono text-neutral-300"
                    >
                      {b.bookingRef}
                    </button>
                  ))}
                  <button
                    onClick={() => setScanInput('DST-INVALID')}
                    className="px-2 py-1 bg-neutral-950 border border-neutral-800 hover:border-neutral-600 rounded text-[11px] font-mono text-neutral-500"
                  >
                    DST-INVALID
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scanner Response Card */}
          <div className="md:col-span-6">
            {scanResult ? (
              scanResult.status === 'valid' && scanResult.booking ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500/60 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">ADMISSION GRANTED</h4>
                      <span className="font-mono text-xs text-emerald-400 font-semibold">
                        Valid Ticket #{scanResult.booking.bookingRef}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-300 border-t border-emerald-900/40 pt-3">
                    <p><strong className="text-white">Movie:</strong> {scanResult.booking.movieTitle}</p>
                    <p><strong className="text-white">Auditorium:</strong> Audi 0{scanResult.booking.audiNumber} ({scanResult.booking.format})</p>
                    <p><strong className="text-white">Seats:</strong> <span className="font-mono text-rose-400 font-bold">{scanResult.booking.seats.join(', ')}</span></p>
                    <p><strong className="text-white">Guest:</strong> {scanResult.booking.userName}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-rose-950/30 border border-rose-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">ADMISSION DENIED</h4>
                      <span className="text-xs text-rose-400">
                        {scanResult.booking?.status === 'Cancelled' ? 'Ticket was cancelled and refunded' : 'No active booking matches this reference'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full min-h-[160px] p-6 bg-neutral-900/30 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center text-neutral-500 text-xs">
                Scan or enter a booking reference code to check admission state.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Add New Movie */}
      {activeTab === 'add_movie' && (
        <div className="max-w-2xl bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Add Feature Movie to Cinema Grid</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Instantly publishes a new title with showtimes across District theatres.
            </p>
          </div>

          {feedback && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Movie Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Odyssey of the Nebulae"
                required
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Catchy Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Beyond the reach of time."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Synopsis</label>
              <textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                rows={2}
                placeholder="Brief plot outline..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-neutral-400 block mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Certificate</label>
                <select
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="U/A">U/A</option>
                  <option value="U">U</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Action">Action</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Drama">Drama</option>
                  <option value="Animation">Animation</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="IMAX 3D">IMAX 3D</option>
                  <option value="4DX">4DX</option>
                  <option value="Dolby Atmos">Dolby Atmos</option>
                  <option value="2D">2D</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Director</label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-sm"
              >
                Publish Movie to Cinema District
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl">
              <span className="text-neutral-400 text-xs font-medium block">Total Box Office Revenue</span>
              <span className="font-mono text-2xl font-bold text-white tabular-nums mt-1 block">
                ${totalRevenue.toFixed(2)}
              </span>
              <span className="text-[11px] text-emerald-400 mt-1 block">✓ Verified receipts</span>
            </div>

            <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl">
              <span className="text-neutral-400 text-xs font-medium block">Total Tickets Reserved</span>
              <span className="font-mono text-2xl font-bold text-rose-400 tabular-nums mt-1 block">
                {totalTicketsSold}
              </span>
              <span className="text-[11px] text-neutral-500 mt-1 block">Across {bookings.length} reservations</span>
            </div>

            <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl">
              <span className="text-neutral-400 text-xs font-medium block">Average Fill Rate</span>
              <span className="font-mono text-2xl font-bold text-amber-400 tabular-nums mt-1 block">
                68.4%
              </span>
              <span className="text-[11px] text-neutral-500 mt-1 block">Peak shows 07:30 PM & 10:45 PM</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
