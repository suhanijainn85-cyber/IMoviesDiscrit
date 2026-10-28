import React, { useState } from 'react';
import { FoodItem, CartFoodItem, Seat, Movie, Theatre, ShowTime } from '../types';
import { FOOD_MENU } from '../data/mockData';
import { ArrowLeft, Plus, Minus, ShoppingBag, Sparkles, Check, ChevronRight } from 'lucide-react';

interface SnackSelectionProps {
  movie: Movie;
  theatre: Theatre;
  show: ShowTime;
  selectedSeats: Seat[];
  ticketAmount: number;
  onBack: () => void;
  onProceedToCheckout: (cartSnacks: CartFoodItem[]) => void;
}

export const SnackSelection: React.FC<SnackSelectionProps> = ({
  movie,
  theatre,
  show,
  selectedSeats,
  ticketAmount,
  onBack,
  onProceedToCheckout,
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Popcorn', 'Snacks', 'Beverages', 'Combos'];

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const filteredItems = activeCategory === 'All'
    ? FOOD_MENU
    : FOOD_MENU.filter((item) => item.category === activeCategory);

  const cartSnacks: CartFoodItem[] = FOOD_MENU
    .filter((item) => (quantities[item.id] || 0) > 0)
    .map((item) => ({ item, quantity: quantities[item.id] }));

  const snacksSubtotal = cartSnacks.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  const totalCombined = ticketAmount + snacksSubtotal;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Header Bar */}
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
              <span className="font-mono text-rose-400 font-semibold">{selectedSeats.length} Seats ({selectedSeats.map(s => s.id).join(', ')})</span>
              <span aria-hidden="true">·</span>
              <span>${ticketAmount} tickets</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Gourmet Cinema Concessions
            </h1>
            <p className="text-xs text-neutral-400">Delivered directly to your seat in Audi {show.audiNumber}</p>
          </div>
        </div>

        {/* Skip button for quick checkout */}
        <button
          onClick={() => onProceedToCheckout([])}
          className="text-xs font-semibold text-neutral-400 hover:text-white underline underline-offset-4"
        >
          Skip Food & Beverage →
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeCategory === cat
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const qty = quantities[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                qty > 0
                  ? 'bg-neutral-900/90 border-rose-500/60 shadow-lg shadow-rose-950/20'
                  : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl" role="img" aria-label={item.name}>
                      {item.imageIcon}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span className="text-emerald-400 font-mono font-medium">${item.price}</span>
                        {item.calories && (
                          <>
                            <span aria-hidden="true" className="text-neutral-600">·</span>
                            <span>{item.calories}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.isVeg && (
                    <span className="w-3.5 h-3.5 rounded-sm border border-emerald-500 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500 font-medium">In-seat service</span>

                {qty === 0 ? (
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-0.5">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="p-1 text-neutral-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono tabular-nums text-xs font-bold text-white px-1">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Summary Bar */}
      <div className="sticky bottom-4 z-30 bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Total Selection:</span>
            <span className="font-mono text-xs font-bold text-white">
              ${ticketAmount} tickets
            </span>
            {snacksSubtotal > 0 && (
              <>
                <span className="text-neutral-500 text-xs">+</span>
                <span className="font-mono text-xs font-bold text-rose-400">
                  ${snacksSubtotal} F&B
                </span>
              </>
            )}
          </div>
          <div className="text-base font-extrabold font-mono tabular-nums text-white mt-0.5">
            ${totalCombined} <span className="text-xs text-neutral-500 font-normal font-sans">total payable</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onProceedToCheckout([])}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white rounded-xl"
          >
            No Snacks
          </button>

          <button
            onClick={() => onProceedToCheckout(cartSnacks)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-950/40 transition-all"
          >
            <span>Proceed to Payment</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
