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
  const [isCartOpen, setIsCartOpen] = useState(false);

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
            <span className="font-serif text-2xl font-bold tracking-wider text-primary">META FASHION</span>
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
                  <Link href="/admin" className="text-textPrimary hover:text-primary transition-colors">
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
                <Link href="/orders" className="text-textPrimary hover:text-primary transition-colors">
                  <Package className="w-5 h-5" />
                </Link>
                <Link href="/wishlist" className="text-textPrimary hover:text-primary transition-colors">
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
                <button onClick={logout} className="text-textPrimary hover:text-primary transition-colors">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
