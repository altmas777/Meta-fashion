"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    users: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get('/api/orders'),
          api.get('/api/products?limit=1000'),
          api.get('/api/users'),
        ]);

        const orders = ordersRes.data.data;
        const products = productsRes.data.data.products;
        const users = usersRes.data.data;

        const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        setStats({
          revenue,
          orders: orders.length,
          products: products.length,
          users: users.length,
        });

        setRecentOrders(orders.slice(0, 10));
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="animate-pulse">Loading dashboard...</div>;

  const STAT_CARDS = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toFixed(2)}`, icon: DollarSign },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart },
    { label: 'Total Products', value: stats.products, icon: Package },
    { label: 'Total Users', value: stats.users, icon: Users },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-primary">Add Product</Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {STAT_CARDS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-surface border border-border p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-background border border-primary flex items-center justify-center text-primary">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-textMuted text-xs uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-serif text-textPrimary">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-serif mb-4">Recent Orders</h2>
        <div className="bg-surface border border-border overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/50 border-b border-border text-textMuted uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">{order.user?.name || 'Unknown User'}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-primary">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs uppercase tracking-wider ${
                      order.status === 'delivered' ? 'text-success border border-success' : 
                      order.status === 'cancelled' ? 'text-error border border-error' : 
                      'text-primary border border-primary'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
