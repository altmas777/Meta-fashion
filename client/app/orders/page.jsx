"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import useAuthStore from '@/store/authStore';
import api from '@/lib/axios';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders/my');
        setOrders(res.data.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-textMuted">Please login to view your orders.</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-warning" />;
      case 'processing': return <Package className="w-5 h-5 text-primary" />;
      case 'shipped': return <Package className="w-5 h-5 text-success" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-error" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-4xl font-serif text-primary mb-12 border-b border-border pb-6">My Orders</h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border">
            <Package className="w-12 h-12 text-textMuted mx-auto mb-4 opacity-50" />
            <p className="text-xl text-textMuted mb-6">You haven't placed any orders yet.</p>
            <Link href="/shop">
              <button className="btn-primary">Start Shopping</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-surface border border-border p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-border pb-6 mb-6 gap-4">
                  <div>
                    <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Order ID: {order._id}</p>
                    <p className="text-sm text-textPrimary">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <span className="uppercase text-sm tracking-wider font-medium text-textPrimary">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <h3 className="text-sm uppercase tracking-wider text-textMuted mb-4">Items</h3>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-16 h-20 bg-background border border-border flex-shrink-0 relative">
                          <img src={item.image || '/placeholder.png'} alt={item.name} className="absolute inset-0 w-full h-full object-cover grayscale" />
                        </div>
                        <div>
                          <p className="text-textPrimary font-medium">{item.name}</p>
                          <p className="text-sm text-textMuted mt-1">Qty: {item.quantity}</p>
                          <p className="text-primary mt-1">₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-background border border-border p-6 h-fit">
                    <h3 className="text-sm uppercase tracking-wider text-textMuted mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-textMuted">Subtotal</span>
                        <span className="text-textPrimary">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-textMuted">Shipping</span>
                        <span className="text-textPrimary">Free</span>
                      </div>
                      <div className="pt-3 border-t border-border flex justify-between font-medium text-lg">
                        <span className="text-textPrimary">Total</span>
                        <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.shippingAddress && (
                      <div className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-sm uppercase tracking-wider text-textMuted mb-4">Delivery To</h3>
                        <p className="text-sm text-textPrimary mb-1">{order.shippingAddress.name}</p>
                        <p className="text-sm text-textMuted">{order.shippingAddress.phone}</p>
                        <p className="text-sm text-textMuted mt-2 leading-relaxed">
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
