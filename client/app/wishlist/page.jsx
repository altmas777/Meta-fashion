"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import ProductGrid from '@/components/ProductGrid';
import useWishlistStore from '@/store/wishlistStore';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, fetchWishlist, isLoading } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CartSidebar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-4xl font-serif text-primary mb-12 border-b border-border pb-6">Your Wishlist</h1>

        {!isAuthenticated ? (
          <div className="text-center py-20 bg-surface border border-border">
            <p className="text-xl text-textMuted mb-6">Please sign in to view your wishlist.</p>
            <Link href="/login">
              <button className="btn-primary">Sign In</button>
            </Link>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border">
            <p className="text-xl text-textMuted mb-6">Your wishlist is currently empty.</p>
            <Link href="/">
              <button className="btn-primary">Discover Products</button>
            </Link>
          </div>
        ) : (
          <ProductGrid products={wishlist} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
}
