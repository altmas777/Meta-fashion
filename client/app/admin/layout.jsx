"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    checkAuth().then(() => setMounted(true));
  }, [checkAuth]);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || user?.role !== 'admin') {
    return <div className="min-h-screen bg-background flex items-center justify-center text-textMuted">Verifying Access...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
