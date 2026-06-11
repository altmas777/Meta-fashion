"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-primary mb-8">Orders Management</h1>

      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-background/50 border-b border-border text-textMuted uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">User Details</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-textMuted">{order._id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-textPrimary">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-textMuted mb-2">{order.user?.email}</p>
                    {order.shippingAddress && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs text-textPrimary font-medium">Delivery:</p>
                        <p className="text-xs text-textMuted">{order.shippingAddress.name} ({order.shippingAddress.phone})</p>
                        <p className="text-xs text-textMuted truncate max-w-[200px]" title={`${order.shippingAddress.address}, ${order.shippingAddress.city}`}>
                          {order.shippingAddress.address}, {order.shippingAddress.city}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-textMuted">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-primary">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-background border border-border text-textPrimary px-3 py-1 text-xs uppercase tracking-wider focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
