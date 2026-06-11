"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/products?limit=100'); // Fetch more for admin list
      setProducts(res.data.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/api/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-primary">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">Add New Product</Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative w-full md:w-96">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border text-textPrimary py-2 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors text-sm"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-textMuted" />
      </div>

      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-background/50 border-b border-border text-textMuted uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8">No products found.</td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={product.images?.[0]?.url || '/placeholder.png'} alt={product.name} className="w-12 h-12 object-cover border border-border" />
                  </td>
                  <td className="px-6 py-4 font-medium text-textPrimary">{product.name}</td>
                  <td className="px-6 py-4 uppercase text-xs tracking-wider text-textMuted">{product.category}</td>
                  <td className="px-6 py-4">
                    ₹{product.discountPrice ? (
                      <span className="text-primary">{product.discountPrice.toFixed(2)}</span>
                    ) : (
                      product.price.toFixed(2)
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={product.stock > 0 ? 'text-success' : 'text-error'}>{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/products/${product._id}/edit`} className="text-textMuted hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="text-textMuted hover:text-error transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
