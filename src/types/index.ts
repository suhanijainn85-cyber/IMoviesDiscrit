export type MovieFormat = 'IMAX 3D' | '4DX' | 'Dolby Atmos' | '2D' | 'ScreenX';

export type MovieGenre = 'Action' | 'Sci-Fi' | 'Thriller' | 'Drama' | 'Adventure' | 'Comedy' | 'Animation';

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  rating: number; // e.g. 8.9
  votesCount: number;
  durationMinutes: number;
  certificate: 'U' | 'U/A' | 'PG-13' | 'R';
  languages: string[];
  formats: MovieFormat[];
  genres: MovieGenre[];
  releaseDate: string;
  posterBg: string; // Gradient or backdrop styling
  posterAccent: string;
  director: string;
  cast: string[];
  trailerUrl?: string;
  isTrending?: boolean;
  isPremiere?: boolean;
}

export interface Theatre {
  id: string;
  name: string;
  district: string;
  address: string;
  distanceKm: number;
  amenities: string[];
  formatsAvailable: MovieFormat[];
}

export type SeatTier = 'Executive' | 'VIP Club' | 'Recliner' | 'Accessible';

export type SeatStatus = 'available' | 'selected' | 'reserved' | 'locked';

export interface Seat {
  id: string; // e.g. "E-8"
  row: string; // "A", "B", ...
  number: number;
  tier: SeatTier;
  price: number;
  status: SeatStatus;
  lockedBy?: string;
}

export interface ShowTime {
  id: string;
  movieId: string;
  theatreId: string;
  time: string; // e.g. "04:30 PM"
  date: string; // "2026-10-28"
  format: MovieFormat;
  audiNumber: number;
  pricing: Record<SeatTier, number>;
  seatsOccupied: string[]; // seat ids that are booked
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Popcorn' | 'Snacks' | 'Beverages' | 'Combos';
  description: string;
  price: number;
  calories?: string;
  isVeg: boolean;
  imageIcon: string;
}

export interface CartFoodItem {
  item: FoodItem;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. "DST-89421"
  userId: string;
  userName: string;
  userEmail: string;
  movieId: string;
  movieTitle: string;
  theatreId: string;
  theatreName: string;
  theatreDistrict: string;
  audiNumber: number;
  format: MovieFormat;
  showDate: string;
  showTime: string;
  seats: string[]; // ["E-4", "E-5"]
  seatTier: SeatTier;
  ticketAmount: number;
  snacks: CartFoodItem[];
  snacksAmount: number;
  convenienceFee: number;
  discountAmount: number;
  totalPaid: number;
  paymentMethod: 'Skill Credits' | 'Credit Card' | 'Apple Pay' | 'UPI';
  creditsDeducted?: number;
  status: 'Confirmed' | 'Cancelled' | 'Checked-In';
  bookedAt: string;
  qrCodeSeed: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: 'user' | 'admin';
  skillCredits: number; // starts at 300
  jwtTokenBalance: number; // e.g. 1
  jwtTokenString: string;
  district: string;
}

export interface KanbanStory {
  id: string;
  epicId: number;
  epicTitle: string;
  title: string;
  category: 'SETUP' | 'BACKEND' | 'DATABASE' | 'FRONTEND' | 'SECURITY' | 'OPTIMIZATION';
  status: 'Done' | 'In Progress' | 'To Do';
  points: number;
  description: string;
}
