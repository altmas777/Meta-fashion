"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ name, email, password });
    if (res.success) {
      toast.success('Welcome to META FASHION');
      router.push('/');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="text-primary font-serif text-2xl mb-12 block lg:hidden text-center">META FASHION</Link>
          
          <h1 className="text-3xl font-serif mb-2 text-textPrimary">Create Account</h1>
          <p className="text-textMuted text-sm mb-8">Join the exclusive circle</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-wider text-textMuted mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-4">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-textMuted">
            Already have an account? <Link href="/login" className="text-primary hover:underline uppercase tracking-wider text-xs ml-1">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Image Side */}
      <div className="hidden lg:flex w-1/2 relative bg-surface">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale-[0.8] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
        <div className="relative z-10 m-auto text-center px-12">
          <h2 className="text-4xl font-serif text-primary mb-4">META FASHION</h2>
          <p className="text-textMuted tracking-widest uppercase text-sm">Discover the exceptional</p>
        </div>
      </div>
    </div>
  );
}
