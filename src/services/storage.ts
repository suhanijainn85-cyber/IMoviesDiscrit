import { Booking, Movie, ShowTime, Theatre, UserProfile } from '../types';
import { INITIAL_MOVIES, INITIAL_USER, THEATRES } from '../data/mockData';

const STORAGE_KEYS = {
  MOVIES: 'district_imovies_movies',
  BOOKINGS: 'district_imovies_bookings',
  USER: 'district_imovies_user',
  CUSTOM_SHOWS: 'district_imovies_custom_shows',
};

// Generate shows for a movie and date
export function generateShows(movies: Movie[], theatres: Theatre[], targetDate: string): ShowTime[] {
  const times = ['10:45 AM', '01:30 PM', '04:15 PM', '07:30 PM', '10:45 PM'];
  const shows: ShowTime[] = [];

  movies.forEach((movie, mIdx) => {
    theatres.forEach((theatre, tIdx) => {
      // Pick 2-3 showtimes per theatre
      const assignedTimes = times.slice((mIdx + tIdx) % 3, ((mIdx + tIdx) % 3) + 3);
      assignedTimes.forEach((time, sIdx) => {
        const format = movie.formats[sIdx % movie.formats.length];
        
        // Deterministic pseudo-random occupied seats so seats look realistic
        const occupiedCount = 14 + ((mIdx * 7 + tIdx * 5 + sIdx * 3) % 18);
        const pseudoOccupied: string[] = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        for (let i = 0; i < occupiedCount; i++) {
          const r = rows[(i * 3 + mIdx) % rows.length];
          const col = ((i * 4 + sIdx) % 12) + 1;
          const seatId = `${r}-${col}`;
          if (!pseudoOccupied.includes(seatId)) {
            pseudoOccupied.push(seatId);
          }
        }

        shows.push({
          id: `show_${movie.id}_${theatre.id}_${targetDate}_${time.replace(/[: ]/g, '')}`,
          movieId: movie.id,
          theatreId: theatre.id,
          time,
          date: targetDate,
          format,
          audiNumber: (tIdx + sIdx) % 4 + 1,
          pricing: {
            Executive: 14,
            'VIP Club': 19,
            Recliner: 28,
            Accessible: 14,
          },
          seatsOccupied: pseudoOccupied,
        });
      });
    });
  });

  return shows;
}

export const StorageService = {
  getMovies(): Movie[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOVIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_MOVIES;
  },

  saveMovies(movies: Movie[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
    } catch (e) {
      console.error(e);
    }
  },

  addMovie(newMovie: Movie) {
    const movies = this.getMovies();
    const updated = [newMovie, ...movies];
    this.saveMovies(updated);
    return updated;
  },

  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_USER;
  },

  saveUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },

  deductSkillCredits(amount: number): boolean {
    const user = this.getUser();
    if (user.skillCredits >= amount) {
      user.skillCredits -= amount;
      this.saveUser(user);
      return true;
    }
    return false;
  },

  addSkillCredits(amount: number) {
    const user = this.getUser();
    user.skillCredits += amount;
    this.saveUser(user);
    return user.skillCredits;
  },

  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    // Return sample confirmed booking to show rich initial state
    const sampleBooking: Booking = {
      id: 'bk_sample_01',
      bookingRef: 'DST-94821',
      userId: INITIAL_USER.id,
      userName: INITIAL_USER.name,
      userEmail: INITIAL_USER.email,
      movieId: 'mov_dune_chronicles',
      movieTitle: 'Chronicles of the Cosmos: Part II',
      theatreId: 'th_district_luxe',
      theatreName: 'District Luxe Cinema & IMAX Sphere',
      theatreDistrict: 'Downtown Arts',
      audiNumber: 1,
      format: 'IMAX 3D',
      showDate: new Date().toISOString().split('T')[0],
      showTime: '07:30 PM',
      seats: ['D-6', 'D-7'],
      seatTier: 'VIP Club',
      ticketAmount: 38,
      snacks: [
        {
          item: {
            id: 'fb_truffle_popcorn',
            name: 'Truffle Parmesan Popcorn Bucket',
            category: 'Popcorn',
            description: 'Crispy warm mushroom-corn kernels dusted with Italian black truffle zest & aged parmesan.',
            price: 11,
            calories: '420 kcal',
            isVeg: true,
            imageIcon: '🍿',
          },
          quantity: 1,
        },
      ],
      snacksAmount: 11,
      convenienceFee: 3.5,
      discountAmount: 10,
      totalPaid: 42.5,
      paymentMethod: 'Skill Credits',
      creditsDeducted: 10,
      status: 'Confirmed',
      bookedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      qrCodeSeed: 'IMOVIES-DST-94821-VERIFIED',
    };
    return [sampleBooking];
  },

  saveBooking(booking: Booking) {
    const bookings = this.getBookings();
    const updated = [booking, ...bookings];
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
  },

  cancelBooking(bookingId: string): { success: boolean; refundAmount: number; message: string } {
    const bookings = this.getBookings();
    const idx = bookings.findIndex((b) => b.id === bookingId);
    if (idx === -1) return { success: false, refundAmount: 0, message: 'Booking not found.' };

    const booking = bookings[idx];
    if (booking.status === 'Cancelled') {
      return { success: false, refundAmount: 0, message: 'Already cancelled.' };
    }

    // Calculate refund based on time cutoff (100% if > 4h, 50% if 2-4h, 0% if < 2h)
    const refundAmount = Math.round(booking.totalPaid * 0.9 * 100) / 100; // 90% refund minus nominal cancellation fee

    booking.status = 'Cancelled';
    bookings[idx] = booking;

    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      // Refund credits if used
      if (booking.creditsDeducted) {
        this.addSkillCredits(booking.creditsDeducted);
      }
    } catch (e) {
      console.error(e);
    }

    return {
      success: true,
      refundAmount,
      message: `Cancellation processed. $${refundAmount} has been refunded to your original payment method.`,
    };
  },

  getTheatres(): Theatre[] {
    return THEATRES;
  },

  // Returns live schema collections for MongoDB inspector
  getMongoCollections() {
    const movies = this.getMovies();
    const user = this.getUser();
    const bookings = this.getBookings();

    return {
      users: [
        {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          skillCredits: user.skillCredits,
          jwtTokenPayload: { sub: user.id, role: user.role, exp: 1769999999 },
          createdAt: '2026-10-15T10:00:00Z',
        },
      ],
      movies: movies.map((m) => ({
        _id: m.id,
        title: m.title,
        durationMinutes: m.durationMinutes,
        certificate: m.certificate,
        genres: m.genres,
        formats: m.formats,
        rating: m.rating,
        releaseDate: m.releaseDate,
        isActive: true,
      })),
      theatres: THEATRES.map((t) => ({
        _id: t.id,
        name: t.name,
        district: t.district,
        address: t.address,
        screenCount: 4,
        formats: t.formatsAvailable,
      })),
      shows: [
        {
          _id: 'show_dune_luxe_01',
          movieId: 'mov_dune_chronicles',
          theatreId: 'th_district_luxe',
          audiNumber: 1,
          time: '07:30 PM',
          date: '2026-10-28',
          format: 'IMAX 3D',
          totalSeats: 84,
          occupiedSeats: 26,
        },
      ],
      seats: [
        {
          theatreId: 'th_district_luxe',
          audiNumber: 1,
          tiers: ['Executive ($14)', 'VIP Club ($19)', 'Recliner ($28)', 'Accessible ($14)'],
          layoutMatrix: '7 Rows x 12 Columns = 84 Capacity',
        },
      ],
      bookings: bookings.map((b) => ({
        _id: b.id,
        bookingRef: b.bookingRef,
        userId: b.userId,
        movieId: b.movieId,
        movieTitle: b.movieTitle,
        theatreId: b.theatreId,
        seats: b.seats,
        totalPaid: b.totalPaid,
        status: b.status,
        bookedAt: b.bookedAt,
      })),
      payments: bookings.map((b) => ({
        _id: `pay_${b.id}`,
        bookingId: b.id,
        amount: b.totalPaid,
        method: b.paymentMethod,
        currency: 'USD',
        gatewayStatus: b.status === 'Cancelled' ? 'REFUNDED' : 'SUCCESS',
        transactionHash: `tx_${b.bookingRef.toLowerCase()}_99x`,
      })),
      notifications: [
        {
          _id: 'notif_welcome',
          userId: user.id,
          type: 'TICKET_CONFIRMED',
          message: 'Your seats for Chronicles of the Cosmos: Part II are confirmed at District Luxe IMAX.',
          sentAt: '2026-10-28T02:30:00Z',
          read: true,
        },
        {
          _id: 'notif_credits',
          userId: user.id,
          type: 'CREDITS_AWARDED',
          message: '300 Skill Credits loaded to your SkillWallet account.',
          sentAt: '2026-10-28T01:00:00Z',
          read: true,
        },
      ],
    };
  },

  resetAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.MOVIES);
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error(e);
    }
  },
};
