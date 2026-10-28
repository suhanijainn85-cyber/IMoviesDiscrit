import React from 'react';
import { Film, Wallet, LayoutGrid, ShieldCheck, Ticket } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeView: 'movies' | 'theatres' | 'tickets' | 'workspace' | 'admin';
  setActiveView: (view: 'movies' | 'theatres' | 'tickets' | 'workspace' | 'admin') => void;
  user: UserProfile;
  bookingsCount: number;
  onOpenWalletModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  user,
  bookingsCount,
  onOpenWalletModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-md border-b border-neutral-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => setActiveView('movies')}
          className="flex items-center gap-2.5 text-left text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/40 group-hover:bg-rose-500 transition-colors">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <span className="text-white text-lg font-bold tracking-tight">IMOVIES</span>
            <span className="text-rose-500 font-extrabold ml-1 tracking-wider text-xs">DISTRICT</span>
          </div>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveView('movies')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeView === 'movies'
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Movies
          </button>

          <button
            onClick={() => setActiveView('theatres')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeView === 'theatres'
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Theatres
          </button>

          <button
            onClick={() => setActiveView('tickets')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeView === 'tickets'
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>My Tickets</span>
            {bookingsCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 bg-rose-500/20 text-rose-400 font-mono rounded">
                {bookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('workspace')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeView === 'workspace'
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-neutral-400" />
            <span>MERN Workspace</span>
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Cinema Studio</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action button / SkillWallet credits */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenWalletModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 border border-neutral-700/80 rounded-lg hover:border-neutral-600 hover:bg-neutral-800 transition-all focus:outline-none"
            title="SkillWallet & Credits"
          >
            <Wallet className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-mono tabular-nums text-rose-300 font-semibold">{user.skillCredits}</span>
            <span className="text-neutral-400 hidden sm:inline">Credits</span>
          </button>

          <button
            onClick={() => setActiveView(activeView === 'tickets' ? 'movies' : 'tickets')}
            className="md:hidden p-2 text-neutral-300 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800"
            title="Tickets"
          >
            <Ticket className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
