"use client";
import Link from 'next/link';
import { ShoppingBag, Heart, User as UserIcon, LogOut, Shield, Package } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="font-serif text-lg md:text-2xl font-bold tracking-wider text-primary">META FASHION</span>
          </Link>

          {/* Center Nav */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest">Home</Link>
            <Link href="/shop" className="text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest">Shop</Link>
            <Link href="/shop?category=Fashion" className="text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest">Fashion</Link>
            <Link href="/shop?category=Electronics" className="text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest">Electronics</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            {mounted && isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="hidden md:block text-textPrimary hover:text-primary transition-colors">
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
                <Link href="/orders" className="hidden md:block text-textPrimary hover:text-primary transition-colors">
                  <Package className="w-5 h-5" />
                </Link>
                <Link href="/wishlist" className="hidden md:block text-textPrimary hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <div className="relative cursor-pointer text-textPrimary hover:text-primary transition-colors" onClick={() => document.dispatchEvent(new CustomEvent('toggleCart'))}>
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <button onClick={logout} className="hidden md:block text-textPrimary hover:text-primary transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <div className="relative cursor-pointer text-textPrimary hover:text-primary transition-colors" onClick={() => document.dispatchEvent(new CustomEvent('toggleCart'))}>
                  <ShoppingBag className="w-5 h-5" />
                  {mounted && cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <Link href="/login" className="text-textPrimary hover:text-primary transition-colors">
                  <UserIcon className="w-5 h-5" />
                </Link>
              </>
            )}
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden ml-4 text-textPrimary hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border mt-2 space-y-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest px-2">Home</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest px-2">Shop</Link>
            <Link href="/shop?category=Fashion" onClick={() => setIsMobileMenuOpen(false)} className="block text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest px-2">Fashion</Link>
            <Link href="/shop?category=Electronics" onClick={() => setIsMobileMenuOpen(false)} className="block text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest px-2">Electronics</Link>
            
            {mounted && isAuthenticated && (
              <div className="border-t border-border/50 pt-4 mt-4 space-y-4">
                {user?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest px-2">
                    <Shield className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest px-2">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-textPrimary hover:text-primary transition-colors text-sm uppercase tracking-widest px-2">
                  <Heart className="w-4 h-4" /> Wishlist
                </Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-error hover:text-error/80 transition-colors text-sm uppercase tracking-widest px-2 w-full text-left">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
