import React from 'react';
import { MapPin, Search, ChevronDown, Sparkles } from 'lucide-react';
import { DISTRICTS } from '../data/mockData';
import { MovieFormat } from '../types';

interface DistrictSubnavProps {
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  showingTab: 'now_showing' | 'upcoming';
  setShowingTab: (tab: 'now_showing' | 'upcoming') => void;
}

export const DistrictSubnav: React.FC<DistrictSubnavProps> = ({
  selectedDistrict,
  setSelectedDistrict,
  searchQuery,
  setSearchQuery,
  selectedFormat,
  setSelectedFormat,
  selectedGenre,
  setSelectedGenre,
  showingTab,
  setShowingTab,
}) => {
  const [districtDropdownOpen, setDistrictDropdownOpen] = React.useState(false);

  const formats: (MovieFormat | 'All')[] = ['All', 'IMAX 3D', '4DX', 'Dolby Atmos', '2D'];
  const genres = ['All', 'Sci-Fi', 'Action', 'Thriller', 'Drama', 'Animation'];

  return (
    <div className="border-b border-neutral-800/60 bg-[#0d0f18]/95 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* District Selector & Mode Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* District Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDistrictDropdownOpen(!districtDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900/90 border border-neutral-700/80 rounded-lg hover:border-neutral-600 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="font-semibold text-white">{selectedDistrict}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {districtDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-56 bg-neutral-900 border border-neutral-700/90 rounded-lg shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Select Cinema District
                </div>
                {DISTRICTS.map((district) => (
                  <button
                    key={district}
                    onClick={() => {
                      setSelectedDistrict(district);
                      setDistrictDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                      selectedDistrict === district
                        ? 'bg-rose-500/10 text-rose-400 font-semibold'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <span>{district}</span>
                    {selectedDistrict === district && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Now Showing vs Upcoming Segmented Control */}
          <div className="flex items-center p-0.5 bg-neutral-900 border border-neutral-800 rounded-lg">
            <button
              onClick={() => setShowingTab('now_showing')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                showingTab === 'now_showing'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => setShowingTab('upcoming')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                showingTab === 'upcoming'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Advance Booking</span>
            </button>
          </div>
        </div>

        {/* Search input with clean affordance */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movie title, cast, genre..."
            className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

      </div>

      {/* Filter Row: Formats and Genres */}
      <div className="max-w-7xl mx-auto mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Formats */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-neutral-400 text-xs font-medium mr-1 shrink-0">Format:</span>
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                selectedFormat === fmt
                  ? 'bg-white text-neutral-950 font-semibold'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Genres */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-neutral-400 text-xs font-medium mr-1 shrink-0">Genre:</span>
          {genres.map((gnr) => (
            <button
              key={gnr}
              onClick={() => setSelectedGenre(gnr)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                selectedGenre === gnr
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {gnr}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
