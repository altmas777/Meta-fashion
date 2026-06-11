"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      // Need to fetch products first to get all reviews since there isn't a global "get all reviews" route natively without product id.
      // Wait, the specification says:
      // GET /api/reviews/product/:id ← all reviews for a product
      // but there is no GET /api/reviews for ALL reviews across products.
      // I need to implement a backend route for getting all reviews for admin.
      // I'll assume we need to update the backend review routes first, but let me check if I added it.
      // Actually, I only added getProductReviews. Let me just show a message or fetch products and aggregate.
      // Let's add the get all reviews route in backend quickly or just fetch products and their reviews.
      
      const productsRes = await api.get('/api/products?limit=100');
      const products = productsRes.data.data.products;
      
      let allReviews = [];
      for (const p of products) {
        const revRes = await api.get(`/api/reviews/product/${p._id}`);
        const pReviews = revRes.data.data.map(r => ({ ...r, productObj: p }));
        allReviews = [...allReviews, ...pReviews];
      }
      
      allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(allReviews);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await api.delete(`/api/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-primary mb-8">Reviews Management</h1>

      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-background/50 border-b border-border text-textMuted uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Comment</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8">No reviews found.</td></tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/products/${review.productObj._id}`} className="hover:text-primary transition-colors">
                      {review.productObj.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{review.user?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-primary' : 'opacity-30'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-textMuted max-w-xs truncate" title={review.comment}>
                    {review.comment}
                  </td>
                  <td className="px-6 py-4 text-textMuted text-xs">{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(review._id)} 
                      className="text-textMuted hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
