"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import ProductGrid from '@/components/ProductGrid';
import api from '@/lib/axios';
import Link from 'next/link';

export default function LandingPage() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      setIsLoading(true);
      try {
        const [prodRes, vidRes] = await Promise.all([
          api.get('/api/products?limit=4'),
          api.get('/api/videos')
        ]);
        setTrendingProducts(prodRes.data.data.products);
        setFeaturedVideos(vidRes.data.data);
      } catch (error) {
        console.error('Failed to fetch landing data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <>
      <Navbar />
      <CartSidebar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] bg-[#111] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl font-serif text-primary mb-6 drop-shadow-lg">META FASHION</h1>
            <p className="text-xl md:text-2xl text-textPrimary tracking-[0.2em] font-light uppercase mb-10">Curated for the Discerning Few</p>
            <Link href="/shop">
              <button className="px-8 py-4 bg-primary text-background uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 shadow-lg">
                Explore Collection
              </button>
            </Link>
          </div>
        </section>

        {/* Featured Videos Section */}
        {featuredVideos.length > 0 && (
          <section className="bg-surface py-24 border-y border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Featured Showcases</h2>
                <div className="w-24 h-px bg-border mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredVideos.map((video) => (
                  <div key={video._id} className="relative aspect-[9/16] bg-black border border-border group overflow-hidden shadow-2xl">
                    <video 
                      src={video.videoUrl} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-none">
                      <h3 className="font-serif text-xl text-primary drop-shadow-md">{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trending Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Trending Now</h2>
            <div className="w-24 h-px bg-border mx-auto"></div>
          </div>

          <ProductGrid products={trendingProducts} isLoading={isLoading} />
          
          <div className="mt-16 text-center">
            <Link href="/shop">
              <button className="btn-primary">View Full Collection</button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-surface border-t border-border py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-serif text-2xl text-primary mb-4">META FASHION</p>
          <p className="text-textMuted text-sm">© {new Date().getFullYear()} META FASHION. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
