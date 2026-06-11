import { create } from 'zustand';
import api from '@/lib/axios';

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/api/wishlist');
      set({ wishlist: res.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch wishlist', error);
    }
  },

  toggleWishlist: async (productId) => {
    try {
      const res = await api.post(`/api/wishlist/toggle/${productId}`);
      set({ wishlist: res.data.data }); // Returns array of IDs
      return res.data.message;
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
      throw error;
    }
  },

  isWishlisted: (productId) => {
    const { wishlist } = get();
    // Wishlist might contain populated objects or just IDs depending on how we fetch it
    return wishlist.some(item => 
      typeof item === 'object' ? item._id === productId : item === productId
    );
  }
}));

export default useWishlistStore;
