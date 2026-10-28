import React, { useState, useEffect } from 'react';
import { Movie, Theatre, ShowTime, Seat, CartFoodItem, Booking, UserProfile } from './types';
import { StorageService, generateShows } from './services/storage';
import { Header } from './components/Header';
import { DistrictSubnav } from './components/DistrictSubnav';
import { MovieList } from './components/MovieList';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { ShowtimePicker } from './components/ShowtimePicker';
import { SeatMap } from './components/SeatMap';
import { SnackSelection } from './components/SnackSelection';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketPass } from './components/TicketPass';
import { BookingHistory } from './components/BookingHistory';
import { TheatresView } from './components/TheatresView';
import { SkillWalletModal } from './components/SkillWalletModal';
import { WorkspaceKanban } from './components/WorkspaceKanban';
import { AdminStudio } from './components/AdminStudio';

export default function App() {
  // App Navigation View
  const [activeView, setActiveView] = useState<'movies' | 'theatres' | 'tickets' | 'workspace' | 'admin'>('movies');

  // Persistent States
  const [movies, setMovies] = useState<Movie[]>(() => StorageService.getMovies());
  const [theatres, setTheatres] = useState<Theatre[]>(() => StorageService.getTheatres());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUser());

  // Filter & District State
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Downtown Arts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [showingTab, setShowingTab] = useState<'now_showing' | 'upcoming'>('now_showing');

  // Active Modals & Flows
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<Movie | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState<
    'idle' | 'showtimes' | 'seats' | 'snacks' | 'checkout' | 'pass'
  >('idle');
  const [activeMovieForBooking, setActiveMovieForBooking] = useState<Movie | null>(null);
  const [activeTheatre, setActiveTheatre] = useState<Theatre | null>(null);
  const [activeShow, setActiveShow] = useState<ShowTime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [ticketAmount, setTicketAmount] = useState<number>(0);
  const [cartSnacks, setCartSnacks] = useState<CartFoodItem[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Refresh user / bookings from storage
  const refreshState = () => {
    setBookings(StorageService.getBookings());
    setUser(StorageService.getUser());
    setMovies(StorageService.getMovies());
  };

  // Filter movies
  const filteredMovies = movies.filter((m) => {
    // Tab filter
    if (showingTab === 'upcoming' && !m.isPremiere) return false;
    if (showingTab === 'now_showing' && m.isPremiere && !m.isTrending) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchCast = m.cast.some((c) => c.toLowerCase().includes(q));
      const matchGenre = m.genres.some((g) => g.toLowerCase().includes(q));
      if (!matchTitle && !matchCast && !matchGenre) return false;
    }

    // Format filter
    if (selectedFormat !== 'All') {
      if (!m.formats.includes(selectedFormat as any)) return false;
    }

    // Genre filter
    if (selectedGenre !== 'All') {
      if (!m.genres.includes(selectedGenre as any)) return false;
    }

    return true;
  });

  // Booking Flow Triggers
  const handleStartBooking = (movie: Movie) => {
    setActiveMovieForBooking(movie);
    setBookingStep('showtimes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectShowtime = (show: ShowTime, theatre: Theatre) => {
    setActiveShow(show);
    setActiveTheatre(theatre);
    setBookingStep('seats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromSeats = (seats: Seat[], total: number) => {
    setSelectedSeats(seats);
    setTicketAmount(total);
    setBookingStep('snacks');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = (snacks: CartFoodItem[]) => {
    setCartSnacks(snacks);
    setBookingStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = (booking: Booking) => {
    setConfirmedBooking(booking);
    refreshState();
    setBookingStep('pass');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetBookingFlow = () => {
    setBookingStep('idle');
    setActiveMovieForBooking(null);
    setActiveTheatre(null);
    setActiveShow(null);
    setSelectedSeats([]);
    setTicketAmount(0);
    setCartSnacks([]);
    setConfirmedBooking(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFormat('All');
    setSelectedGenre('All');
    setShowingTab('now_showing');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 flex flex-col font-sans">
      
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          handleResetBookingFlow();
        }}
        user={user}
        bookingsCount={bookings.filter((b) => b.status === 'Confirmed').length}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Subnav (shown when in movies view and not in active booking flow) */}
      {activeView === 'movies' && bookingStep === 'idle' && (
        <DistrictSubnav
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          showingTab={showingTab}
          setShowingTab={setShowingTab}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: Booking Flow Steps */}
        {bookingStep === 'showtimes' && activeMovieForBooking && (
          <ShowtimePicker
            movie={activeMovieForBooking}
            theatres={theatres}
            selectedDistrict={selectedDistrict}
            onBack={handleResetBookingFlow}
            onSelectShowtime={handleSelectShowtime}
            generateShows={generateShows}
          />
        )}

        {bookingStep === 'seats' && activeMovieForBooking && activeTheatre && activeShow && (
          <SeatMap
            movie={activeMovieForBooking}
            theatre={activeTheatre}
            show={activeShow}
            onBack={() => setBookingStep('showtimes')}
            onProceedToFoodOrCheckout={handleProceedFromSeats}
          />
        )}

        {bookingStep === 'snacks' && activeMovieForBooking && activeTheatre && activeShow && (
          <SnackSelection
            movie={activeMovieForBooking}
            theatre={activeTheatre}
            show={activeShow}
            selectedSeats={selectedSeats}
            ticketAmount={ticketAmount}
            onBack={() => setBookingStep('seats')}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {bookingStep === 'checkout' && activeMovieForBooking && activeTheatre && activeShow && (
          <CheckoutModal
            movie={activeMovieForBooking}
            theatre={activeTheatre}
            show={activeShow}
            selectedSeats={selectedSeats}
            ticketAmount={ticketAmount}
            cartSnacks={cartSnacks}
            user={user}
            onBack={() => setBookingStep('snacks')}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {bookingStep === 'pass' && confirmedBooking && (
          <TicketPass
            booking={confirmedBooking}
            onBackToMovies={handleResetBookingFlow}
            onBookingCancelled={refreshState}
          />
        )}

        {/* VIEW 2: Default Movies View (when not in booking flow) */}
        {bookingStep === 'idle' && activeView === 'movies' && (
          <MovieList
            movies={filteredMovies}
            district={selectedDistrict}
            onSelectMovie={(movie) => setSelectedMovieForDetails(movie)}
            onBookTickets={handleStartBooking}
            onWatchTrailer={(movie) => setSelectedMovieForDetails(movie)}
            onResetFilters={handleResetFilters}
          />
        )}

        {/* VIEW 3: Theatres Directory */}
        {bookingStep === 'idle' && activeView === 'theatres' && (
          <TheatresView
            theatres={theatres}
            movies={movies}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            onSelectMovieForBooking={handleStartBooking}
          />
        )}

        {/* VIEW 4: My Tickets */}
        {bookingStep === 'idle' && activeView === 'tickets' && (
          <BookingHistory
            bookings={bookings}
            onSelectBooking={(b) => {
              setConfirmedBooking(b);
              setBookingStep('pass');
            }}
            onExploreMovies={() => setActiveView('movies')}
            onRefreshBookings={refreshState}
          />
        )}

        {/* VIEW 5: MERN Workspace & Kanban Hub */}
        {bookingStep === 'idle' && activeView === 'workspace' && (
          <WorkspaceKanban
            user={user}
            onSwitchToCinema={() => setActiveView('movies')}
          />
        )}

        {/* VIEW 6: Cinema Admin Studio */}
        {bookingStep === 'idle' && activeView === 'admin' && (
          <AdminStudio
            movies={movies}
            theatres={theatres}
            bookings={bookings}
            onMovieAdded={(newMovie) => {
              setMovies(StorageService.getMovies());
            }}
            onDataReset={() => {
              StorageService.resetAll();
              refreshState();
            }}
          />
        )}
      </main>

      {/* Movie Details & Trailer Modal */}
      <MovieDetailsModal
        movie={selectedMovieForDetails}
        onClose={() => setSelectedMovieForDetails(null)}
        onBookTickets={handleStartBooking}
      />

      {/* SkillWallet & Credits Modal */}
      <SkillWalletModal
        user={user}
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onUpdateUser={(updated) => setUser(updated)}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-[#090a0f] py-6 px-4 lg:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">IMOVIES</span>
            <span className="text-rose-500 font-bold">DISTRICT</span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span>MERN Stack Cinema Management System</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView('workspace')}
              className="hover:text-neutral-300 transition-colors"
            >
              MERN Curriculum
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className="hover:text-neutral-300 transition-colors"
            >
              Gate Scanner
            </button>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="hover:text-neutral-300 transition-colors font-mono"
            >
              SkillWallet ({user.skillCredits} Cr)
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
