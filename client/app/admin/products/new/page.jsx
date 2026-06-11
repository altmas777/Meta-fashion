"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import CloudinaryUploader from '@/components/CloudinaryUploader';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error('Please upload at least one image');
    if (Number(formData.price) <= 0) return toast.error('Price must be greater than 0');

    setIsSubmitting(true);
    try {
      await api.post('/api/products', {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        images
      });
      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif text-primary mb-8">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-surface p-8 border border-border space-y-6">
          <h2 className="text-xl font-serif mb-4 border-b border-border pb-2">Basic Info</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Product Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field appearance-none bg-surface">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Description</label>
            <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="input-field resize-none" />
          </div>
        </div>

        <div className="bg-surface p-8 border border-border space-y-6">
          <h2 className="text-xl font-serif mb-4 border-b border-border pb-2">Pricing & Inventory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Price (₹)</label>
              <input type="number" step="0.01" name="price" required min="0" value={formData.price} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Discount Price (₹) Optional</label>
              <input type="number" step="0.01" name="discountPrice" min="0" value={formData.discountPrice} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Stock Quantity</label>
              <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} className="input-field" />
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 accent-primary bg-surface border-border rounded-none" />
            <label htmlFor="isActive" className="ml-2 text-sm text-textPrimary">Product is Active</label>
          </div>
        </div>

        <div className="bg-surface p-8 border border-border space-y-6">
          <h2 className="text-xl font-serif mb-4 border-b border-border pb-2">Product Images</h2>
          <CloudinaryUploader items={images} setItems={setImages} />
        </div>

        <div className="flex gap-4 justify-end">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-border text-textMuted hover:text-textPrimary transition-colors uppercase text-sm tracking-wider">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Saving...' : 'Save Product'}</button>
        </div>
      </form>
    </div>
  );
}
