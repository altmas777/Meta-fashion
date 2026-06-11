import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product === product._id);
          
          if (existingItem) {
            return {
              items: state.items.map(item => 
                item.product === product._id 
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          
          return {
            items: [...state.items, {
              product: product._id,
              name: product.name,
              price: product.discountPrice || product.price,
              image: product.images[0]?.url,
              quantity,
              stock: product.stock
            }]
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.product !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(item =>
            item.product === productId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
