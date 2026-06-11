"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import api from '@/lib/axios';
import { Star, Heart, Minus, Plus } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { addToCart } = useCartStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const wishlisted = isWishlisted(id);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/api/products/${id}`),
          api.get(`/api/reviews/product/${id}`)
        ]);
        setProduct(productRes.data.data);
        setReviews(reviewsRes.data.data);
      } catch (error) {
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-textMuted uppercase tracking-widest text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif mb-4">Product Not Found</h1>
        <button onClick={() => window.history.back()} className="btn-primary">Go Back</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Added to cart');
    document.dispatchEvent(new CustomEvent('toggleCart'));
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    try {
      const msg = await toggleWishlist(product._id);
      toast.success(msg);
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to review');
    setIsSubmittingReview(true);
    try {
      const res = await api.post('/api/reviews', { product: id, rating, comment });
      setReviews([...reviews, { ...res.data.data, user: { name: user.name } }]);
      setComment('');
      toast.success('Review submitted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <>
      <Navbar />
      <CartSidebar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Product Details Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-[4/5] bg-surface border border-border">
              <img 
                src={product.images?.[activeImage]?.url || '/placeholder.png'} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-32 flex-shrink-0 border transition-all ${activeImage === idx ? 'border-primary' : 'border-border opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt={`${product.name} ${idx}`} className="absolute inset-0 w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <p className="text-textMuted uppercase tracking-widest text-sm mb-2">{product.category}</p>
            <h1 className="text-4xl lg:text-5xl font-serif text-textPrimary mb-6">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl text-primary font-medium">₹{product.discountPrice.toFixed(2)}</span>
                  <span className="text-xl text-textMuted line-through">₹{product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-2xl text-primary font-medium">₹{product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-8">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.ratings.average) ? 'fill-primary' : 'opacity-30'}`} />
                ))}
              </div>
              <span className="text-textMuted text-sm">({product.ratings.count} reviews)</span>
            </div>

            <p className="text-textMuted leading-relaxed mb-8">{product.description}</p>

            {/* Actions */}
            <div className="space-y-6 mt-auto">
              <div className="flex items-center gap-4">
                <span className={`text-sm uppercase tracking-wider ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border bg-surface h-12">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-textMuted hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 text-textMuted hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button onClick={handleAddToCart} className="btn-primary flex-1 h-12">Add to Cart</button>
                  <button onClick={handleWishlist} className={`h-12 w-12 flex items-center justify-center border border-border bg-surface transition-colors hover:border-primary ${wishlisted ? 'text-error border-error' : 'text-textPrimary'}`}>
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-error' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-border pt-16">
          <h2 className="text-3xl font-serif mb-12">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-8">
              {reviews.length === 0 ? (
                <p className="text-textMuted italic">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="bg-surface p-6 border border-border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium">{review.user?.name || 'User'}</p>
                        <p className="text-xs text-textMuted mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-primary' : 'opacity-30'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-textMuted text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Review Form */}
            <div className="bg-surface p-8 border border-border h-fit sticky top-24">
              <h3 className="font-serif text-xl mb-6">Write a Review</h3>
              {!isAuthenticated ? (
                <p className="text-sm text-textMuted">Please log in to write a review.</p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-primary focus:outline-none transition-transform hover:scale-110`}
                        >
                          <Star className={`w-6 h-6 ${rating >= star ? 'fill-primary' : 'opacity-30'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Comment</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="input-field min-h-[120px] resize-none"
                      placeholder="Share your thoughts..."
                    />
                  </div>
                  <button type="submit" disabled={isSubmittingReview} className="btn-primary w-full">
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
