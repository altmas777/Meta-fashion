"use client";
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleToggle = () => setIsOpen(prev => !prev);
    document.addEventListener('toggleCart', handleToggle);
    return () => document.removeEventListener('toggleCart', handleToggle);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-surface border-l border-border z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-serif text-primary flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Your Cart
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-primary transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-textMuted space-y-4">
                <ShoppingBag className="w-16 h-16 opacity-20" />
                <p>Your cart is empty</p>
                <button onClick={() => setIsOpen(false)} className="btn-primary mt-4">
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product} className="flex gap-4 items-center bg-background p-3 border border-border">
                  <div className="relative w-20 h-24 flex-shrink-0">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-textPrimary truncate">{item.name}</h3>
                    <p className="text-primary mt-1">₹{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-border">
                        <button 
                          onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-textMuted hover:text-primary transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs px-2 min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product, Math.min(item.stock, item.quantity + 1))}
                          className="px-2 py-1 text-textMuted hover:text-primary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product)}
                        className="text-xs text-error hover:underline uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-surface">
              <div className="flex justify-between text-lg font-medium mb-6">
                <span>Subtotal</span>
                <span className="text-primary">₹{getCartTotal().toFixed(2)}</span>
              </div>
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <button className="w-full btn-primary text-center">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
