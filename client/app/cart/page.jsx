"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedAddress = localStorage.getItem('metaFashionAddress');
    if (savedAddress) {
      try {
        setFormData(JSON.parse(savedAddress));
      } catch (e) {}
    }
  }, []);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }
    if (items.length === 0) return toast.error('Cart is empty');
    setShowCheckoutForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsPlacingOrder(true);
    try {
      // Save address for future use
      localStorage.setItem('metaFashionAddress', JSON.stringify(formData));

      const res = await api.post('/api/orders', {
        items: items.map(i => ({ product: i.product, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
        totalAmount: getCartTotal(),
        shippingAddress: formData
      });

      if (res.data.success) {
        toast.success('Order placed! Redirecting to WhatsApp...');
        
        const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE || '+919876543210';
        let message = `Hello META FASHION Admin,\n\nI would like to place an order:\n\n*Order ID*: ${res.data.data._id}\n*Items*:\n`;
        items.forEach(item => {
          message += `- ${item.quantity}x ${item.name} (₹${item.price.toFixed(2)})\n`;
        });
        message += `\n*Total Amount*: ₹${getCartTotal().toFixed(2)}\n\n`;
        message += `*Delivery Details*:\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n\nPlease confirm my order.`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${adminPhone.replace('+', '')}?text=${encodedMessage}`;
        
        clearCart();
        
        // Force redirect in same tab to bypass mobile popup blockers
        window.location.href = waUrl;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CartSidebar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-4xl font-serif text-primary mb-12 border-b border-border pb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border">
            <p className="text-xl text-textMuted mb-6">Your cart is currently empty.</p>
            <Link href="/shop">
              <button className="btn-primary">Return to Shop</button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="lg:w-2/3 space-y-6">
              {items.map((item) => (
                <div key={item.product} className="flex flex-col sm:flex-row gap-6 bg-surface p-6 border border-border">
                  <div className="w-24 h-32 relative flex-shrink-0 bg-background border border-border">
                    <img 
                      src={item.image || '/placeholder.png'} 
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-lg text-textPrimary mb-1">{item.name}</h3>
                        <p className="text-primary">₹{item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product)}
                        className="text-textMuted hover:text-error transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center border border-border bg-background">
                        <button 
                          onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))}
                          className="px-3 py-2 text-textMuted hover:text-primary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product, Math.min(item.stock, item.quantity + 1))}
                          className="px-3 py-2 text-textMuted hover:text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-textPrimary font-medium">
                        Total: ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary / Checkout Form */}
            <div className="lg:w-1/3">
              <div className="bg-surface p-8 border border-border sticky top-24">
                <h3 className="font-serif text-2xl mb-6 border-b border-border pb-4">
                  {showCheckoutForm ? 'Delivery Details' : 'Order Summary'}
                </h3>
                
                {!showCheckoutForm ? (
                  <>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-textMuted">
                        <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                        <span>₹{getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-textMuted">
                        <span>Shipping</span>
                        <span className="uppercase text-xs tracking-wider text-primary">Complimentary</span>
                      </div>
                      <div className="border-t border-border pt-4 flex justify-between text-lg font-medium">
                        <span>Total</span>
                        <span className="text-primary">₹{getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCheckoutClick}
                      className="w-full btn-primary py-4 text-sm"
                    >
                      Proceed to Checkout
                    </button>
                  </>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Full Name</label>
                      <input type="text" name="name" placeholder="John Doe" required value={formData.name} onChange={handleFormChange} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">WhatsApp Number</label>
                      <input type="tel" name="phone" placeholder="+91 9876543210" required value={formData.phone} onChange={handleFormChange} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Full Address</label>
                      <input type="text" name="address" placeholder="House No, Street, Landmark" required value={formData.address} onChange={handleFormChange} className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">City</label>
                        <input type="text" name="city" placeholder="Mumbai" required value={formData.city} onChange={handleFormChange} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">State</label>
                        <input type="text" name="state" placeholder="Maharashtra" required value={formData.state} onChange={handleFormChange} className="input-field" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Pincode</label>
                      <input type="text" name="pincode" placeholder="400001" required value={formData.pincode} onChange={handleFormChange} className="input-field" />
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-lg font-medium mb-6">
                        <span>Total Payable</span>
                        <span className="text-primary">₹{getCartTotal().toFixed(2)}</span>
                      </div>
                      <button 
                        type="submit"
                        disabled={isPlacingOrder}
                        className="w-full btn-primary py-4 text-sm flex justify-center items-center gap-2"
                      >
                        {isPlacingOrder ? 'Processing...' : 'Buy via WhatsApp'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowCheckoutForm(false)}
                        className="w-full mt-3 py-3 text-sm uppercase tracking-wider text-textMuted hover:text-textPrimary transition-colors"
                      >
                        Back to Cart
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
