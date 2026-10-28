import React, { useState } from 'react';
import { Movie, Theatre, ShowTime, Seat, CartFoodItem, Booking, UserProfile } from '../types';
import { ArrowLeft, CheckCircle2, CreditCard, Wallet, Tag, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storage';

interface CheckoutModalProps {
  movie: Movie;
  theatre: Theatre;
  show: ShowTime;
  selectedSeats: Seat[];
  ticketAmount: number;
  cartSnacks: CartFoodItem[];
  user: UserProfile;
  onBack: () => void;
  onPaymentSuccess: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  movie,
  theatre,
  show,
  selectedSeats,
  ticketAmount,
  cartSnacks,
  user,
  onBack,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'Skill Credits' | 'Credit Card' | 'Apple Pay' | 'UPI'>('Skill Credits');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Credit card form state
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  const snacksAmount = cartSnacks.reduce((sum, s) => sum + s.item.price * s.quantity, 0);
  const convenienceFee = 3.5;
  const grossTotal = ticketAmount + snacksAmount + convenienceFee;

  // Calculate discount
  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const netTotal = Math.max(0, grossTotal - discountAmount);

  // Skill Credits logic
  const creditsNeeded = Math.ceil(netTotal);
  const canUseCredits = user.skillCredits >= creditsNeeded;

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'DISTRICT20') {
      const disc = Math.round(grossTotal * 0.2 * 100) / 100;
      setAppliedPromo({ code: 'DISTRICT20', discount: disc });
    } else if (code === 'MOVIEBUFF') {
      setAppliedPromo({ code: 'MOVIEBUFF', discount: 5.0 });
    } else if (code === 'SKILLWALLET') {
      const disc = Math.round(grossTotal * 0.5 * 100) / 100;
      setAppliedPromo({ code: 'SKILLWALLET', discount: disc });
    } else {
      setPromoError('Invalid promo code. Try "DISTRICT20" or "MOVIEBUFF"');
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      let creditsDeducted = 0;
      if (paymentMethod === 'Skill Credits') {
        creditsDeducted = creditsNeeded;
        StorageService.deductSkillCredits(creditsDeducted);
      }

      const randomRefNumber = Math.floor(10000 + Math.random() * 90000);
      const bookingRef = `DST-${randomRefNumber}`;

      const newBooking: Booking = {
        id: `bk_${Date.now()}`,
        bookingRef,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        movieId: movie.id,
        movieTitle: movie.title,
        theatreId: theatre.id,
        theatreName: theatre.name,
        theatreDistrict: theatre.district,
        audiNumber: show.audiNumber,
        format: show.format,
        showDate: show.date,
        showTime: show.time,
        seats: selectedSeats.map((s) => s.id),
        seatTier: selectedSeats[0]?.tier || 'Executive',
        ticketAmount,
        snacks: cartSnacks,
        snacksAmount,
        convenienceFee,
        discountAmount,
        totalPaid: netTotal,
        paymentMethod,
        creditsDeducted: creditsDeducted > 0 ? creditsDeducted : undefined,
        status: 'Confirmed',
        bookedAt: new Date().toISOString(),
        qrCodeSeed: `IMOVIES-DISTRICT-${bookingRef}-${user.id}`,
      };

      StorageService.saveBooking(newBooking);
      setIsProcessing(false);
      onPaymentSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-neutral-800">
        <button
          onClick={onBack}
          className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Checkout & Booking Confirmation</h1>
          <p className="text-xs text-neutral-400">Review your movie seats, snacks, and payment breakdown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Order Summary & Promo Code (7 cols) */}
        <div className="md:col-span-7 space-y-5">
          
          {/* Movie & Show Info Card */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                  {show.format} · Audi {show.audiNumber}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{movie.title}</h3>
                <p className="text-xs text-neutral-400">{theatre.name} ({theatre.district})</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-white block">{show.time}</span>
                <span className="text-[11px] text-neutral-500">{show.date}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Selected Seats:</span>
              <span className="font-mono font-bold text-rose-300">
                {selectedSeats.map((s) => s.id).join(', ')} ({selectedSeats[0]?.tier})
              </span>
            </div>
          </div>

          {/* Itemized Pricing */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-2.5 text-xs">
            <h4 className="font-semibold text-neutral-300 uppercase tracking-wider text-[11px] mb-2">
              Payment Breakdown
            </h4>

            <div className="flex justify-between text-neutral-300">
              <span>Movie Tickets ({selectedSeats.length}x {selectedSeats[0]?.tier})</span>
              <span className="font-mono tabular-nums">${ticketAmount.toFixed(2)}</span>
            </div>

            {cartSnacks.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-neutral-800/60">
                {cartSnacks.map(({ item, quantity }) => (
                  <div key={item.id} className="flex justify-between text-neutral-400 text-[11px]">
                    <span>{quantity}x {item.name}</span>
                    <span className="font-mono tabular-nums">${(item.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-neutral-300 pt-1 font-medium">
                  <span>Snacks & Concessions Subtotal</span>
                  <span className="font-mono tabular-nums">${snacksAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between text-neutral-400 pt-1 border-t border-neutral-800/60">
              <span>District Booking Fee & Taxes</span>
              <span className="font-mono tabular-nums">${convenienceFee.toFixed(2)}</span>
            </div>

            {appliedPromo && (
              <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                <span>Promo Discount ({appliedPromo.code})</span>
                <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-neutral-700/80 flex justify-between items-baseline text-white">
              <span className="font-bold text-sm">Total Payable</span>
              <span className="font-mono font-extrabold text-xl text-rose-400 tabular-nums">
                ${netTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Promo Code Box */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              <span>Have a Promo Voucher?</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Try DISTRICT20 or MOVIEBUFF"
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 uppercase font-mono focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={handleApplyPromo}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors"
              >
                Apply
              </button>
            </div>

            {appliedPromo && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Code {appliedPromo.code} applied successfully!</span>
              </p>
            )}

            {promoError && (
              <p className="text-[11px] text-rose-400">{promoError}</p>
            )}
          </div>

        </div>

        {/* Right Column: Payment Methods & Action (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          
          <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-4">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Select Payment Method
            </h4>

            {/* Option 1: SkillWallet Credits */}
            <div
              onClick={() => setPaymentMethod('Skill Credits')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'Skill Credits'
                  ? 'bg-rose-950/20 border-rose-500/80 shadow-md'
                  : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>SkillWallet Credits</span>
                      <span className="text-[10px] font-mono font-semibold text-rose-400 bg-rose-500/20 px-1.5 py-0.2 rounded">
                        1 Credit = $1
                      </span>
                    </h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Available: <strong className="text-white font-mono">{user.skillCredits} credits</strong>
                    </p>
                  </div>
                </div>

                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'Skill Credits' ? 'border-rose-500 bg-rose-500' : 'border-neutral-600'
                }`}>
                  {paymentMethod === 'Skill Credits' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {paymentMethod === 'Skill Credits' && (
                <div className="mt-3 pt-2.5 border-t border-rose-900/40 text-[11px] text-neutral-300">
                  {canUseCredits ? (
                    <span className="text-emerald-400">
                      ✓ Instant deduction of {creditsNeeded} credits. No card required!
                    </span>
                  ) : (
                    <span className="text-rose-400">
                      Need {creditsNeeded} credits. You have {user.skillCredits}.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Option 2: Credit / Debit Card */}
            <div
              onClick={() => setPaymentMethod('Credit Card')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'Credit Card'
                  ? 'bg-rose-950/20 border-rose-500/80 shadow-md'
                  : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Credit / Debit Card</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Visa, Mastercard, Amex</p>
                  </div>
                </div>

                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'Credit Card' ? 'border-rose-500 bg-rose-500' : 'border-neutral-600'
                }`}>
                  {paymentMethod === 'Credit Card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {paymentMethod === 'Credit Card' && (
                <div className="mt-3 pt-2.5 border-t border-neutral-800 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400">Card Number</span>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-xs text-white font-mono mt-0.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-neutral-400">Expiry</span>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-xs text-white font-mono mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400">CVV</span>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-xs text-white font-mono mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Option 3: Apple Pay / UPI */}
            <div
              onClick={() => setPaymentMethod('Apple Pay')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'Apple Pay'
                  ? 'bg-rose-950/20 border-rose-500/80 shadow-md'
                  : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold text-xs">
                    
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Apple Pay / Digital Wallet</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Biometric instant 1-tap checkout</p>
                  </div>
                </div>

                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'Apple Pay' ? 'border-rose-500 bg-rose-500' : 'border-neutral-600'
                }`}>
                  {paymentMethod === 'Apple Pay' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>256-bit encrypted transaction · Instant ticket issuance</span>
            </div>

            {/* Confirm Payment CTA */}
            <button
              disabled={isProcessing || (paymentMethod === 'Skill Credits' && !canUseCredits)}
              onClick={handleConfirmPayment}
              className={`w-full py-3.5 px-4 text-xs font-bold rounded-xl text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isProcessing
                  ? 'bg-neutral-800 text-neutral-400 cursor-wait'
                  : paymentMethod === 'Skill Credits' && !canUseCredits
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/40'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Authorizing Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay ${netTotal.toFixed(2)} & Confirm Seats</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
