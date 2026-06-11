"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import ProductGrid from '@/components/ProductGrid';
import api from '@/lib/axios';
import { Search } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

export default function ShopPage({ searchParams }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (searchParams?.category) {
      setCategory(searchParams.category);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category && category !== 'All') queryParams.append('category', category);
        if (debouncedSearch) queryParams.append('search', debouncedSearch);
        
        const res = await api.get(`/api/products?${queryParams.toString()}`);
        setProducts(res.data.data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, debouncedSearch]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CartSidebar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-4xl font-serif text-primary mb-12 border-b border-border pb-6">Our Collection</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 pb-4">
          {/* Categories */}
          <div className="flex gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
                  category === cat ? 'text-primary border-b-2 border-primary pb-1' : 'text-textMuted hover:text-textPrimary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border text-textPrimary py-2 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-textMuted" />
          </div>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </main>

      <footer className="bg-surface border-t border-border py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-serif text-2xl text-primary mb-4">META FASHION</p>
          <p className="text-textMuted text-sm">© {new Date().getFullYear()} META FASHION. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
