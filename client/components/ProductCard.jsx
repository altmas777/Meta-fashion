"use client";
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const wishlisted = isWishlisted(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      const msg = await toggleWishlist(product._id);
      toast.success(msg);
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart');
    document.dispatchEvent(new CustomEvent('toggleCart'));
  };

  return (
    <div className="group card flex flex-col relative overflow-hidden">
      {/* Top Border Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-10" />
      
      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className="absolute top-4 right-4 z-20 p-2 bg-background/50 backdrop-blur-sm border border-border hover:border-primary transition-colors"
      >
        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-error text-error' : 'text-textPrimary'}`} />
      </button>

      <Link href={`/products/${product._id}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#151515]">
          <img 
            src={product.images?.[0]?.url || '/placeholder.png'} 
            alt={product.name}
            className="w-full h-full object-cover object-center grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
          {product.discountPrice && (
            <div className="absolute bottom-4 left-4 bg-background border border-primary px-3 py-1 text-xs uppercase tracking-widest text-primary">
              Sale
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-serif text-lg text-textPrimary mb-1 truncate">{product.name}</h3>
          <p className="text-sm text-textMuted mb-3 uppercase tracking-wider text-xs">{product.category}</p>
          
          <div className="mt-auto flex items-end justify-between">
            <div>
              {product.discountPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-primary font-medium">₹{product.discountPrice.toFixed(2)}</span>
                  <span className="text-textMuted line-through text-sm">₹{product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-primary font-medium">₹{product.price.toFixed(2)}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-textMuted text-xs">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span>{product.ratings?.average?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to cart overlay button on hover (desktop) */}
      <div className="px-5 pb-5 pt-0 opacity-100 sm:opacity-0 sm:-translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full btn-primary"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
