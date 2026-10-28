import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Wallet, CreditCard, Sparkles, ShieldCheck, Key, Plus, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storage';

interface SkillWalletModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

export const SkillWalletModal: React.FC<SkillWalletModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'bank' | 'jwt'>('card');
  const [topupAmount, setTopupAmount] = useState<number>(50);
  const [feedback, setFeedback] = useState<string>('');

  if (!isOpen) return null;

  const handleTopup = (amt: number) => {
    const updatedCredits = StorageService.addSkillCredits(amt);
    const updatedUser = { ...user, skillCredits: updatedCredits };
    onUpdateUser(updatedUser);
    setFeedback(`+${amt} Skill Credits successfully added to your SkillWallet!`);
    setTimeout(() => setFeedback(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">SkillWallet & Skill Bank</h2>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded font-semibold">
                  MERN STACK VERIFIED
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Full stack developer rewards, JWT tokens & cinema credit redemption
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-2">
            <button
              onClick={() => setActiveTab('card')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'card'
                  ? 'bg-rose-600 text-white'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
              }`}
            >
              Skill Card
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'bank'
                  ? 'bg-rose-600 text-white'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
              }`}
            >
              Skill Bank Top-up
            </button>
            <button
              onClick={() => setActiveTab('jwt')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'jwt'
                  ? 'bg-rose-600 text-white'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-white'
              }`}
            >
              JWT Auth Payload
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {feedback && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-4">
              {/* Sleek Metallic Skill Card */}
              <div className="relative w-full aspect-[1.58/1] rounded-2xl p-6 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-700 shadow-2xl flex flex-col justify-between overflow-hidden">
                {/* Visual foil reflection line */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
                      SKILLWALLET PASS
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                      District Titanium VIP
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 block font-mono">CHIP ID</span>
                    <span className="font-mono text-xs text-rose-400 font-bold">MERN-2026</span>
                  </div>
                </div>

                {/* EMV Chip visual */}
                <div className="w-11 h-8 rounded-md bg-amber-400/20 border border-amber-400/40 relative z-10 flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-400/30 rounded-sm" />
                </div>

                {/* Balance & Details */}
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Cardholder
                    </span>
                    <span className="font-bold text-sm text-white tracking-wide">
                      {user.name} ({user.initials})
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono block mt-0.5">
                      •••• •••• •••• 9928
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Available Balance
                    </span>
                    <div className="text-2xl font-extrabold font-mono tabular-nums text-rose-400">
                      {user.skillCredits} <span className="text-xs text-white font-sans font-medium">Credits</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Perks */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <span className="text-[11px] text-neutral-400 block font-medium">Redemption Rate</span>
                  <span className="text-white font-semibold mt-0.5 block">1 Credit = $1.00 USD</span>
                </div>
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <span className="text-[11px] text-neutral-400 block font-medium">JWT AI Tokens</span>
                  <span className="text-white font-semibold mt-0.5 block">{user.jwtTokenBalance} Tokens</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Developer Reward & Top-up Sandbox
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Top up credits to test cinema checkouts, snacks, or seat booking workflows.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleTopup(amt)}
                    className="p-4 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-rose-500/60 rounded-xl text-center transition-all group"
                  >
                    <span className="text-xl font-bold font-mono text-white group-hover:text-rose-400 block">
                      +{amt}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium uppercase mt-0.5 block">
                      Credits
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>How Credits Work in IMovies District</span>
                </div>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  When you select &ldquo;Skill Credits&rdquo; at checkout, the full ticket or snack price is automatically converted 1:1 and deducted from your Skill Card. No external credit card credentials required!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'jwt' && (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cryptographic JWT Bearer Token</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Issued upon user registration with role & credit claims
                </p>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-300 break-all leading-relaxed">
                <span className="text-rose-400 font-bold">{user.jwtTokenString.split('.')[0]}</span>.
                <span className="text-amber-400 font-bold">{user.jwtTokenString.split('.')[1]}</span>.
                <span className="text-sky-400">{user.jwtTokenString.split('.')[2]}</span>
              </div>

              <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-1 text-xs">
                <div className="text-[11px] text-neutral-400 font-medium">Decoded Payload Claims:</div>
                <div className="font-mono text-[11px] text-neutral-200">
                  {JSON.stringify({ sub: user.id, name: user.name, role: user.role, credits: user.skillCredits, exp: 1761637284 }, null, 2)}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-500">Linked to: {user.email}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors font-medium"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
