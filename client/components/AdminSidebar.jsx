"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Star, LogOut, Store, PlaySquare } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/videos', label: 'Videos', icon: PlaySquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="font-serif text-2xl text-primary tracking-wider">META FASHION</Link>
        <span className="ml-2 text-xs uppercase tracking-widest text-textMuted mt-1">Admin</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link 
              key={href} 
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-wider transition-colors ${isActive ? 'bg-background text-primary border border-border border-l-2 border-l-primary' : 'text-textMuted hover:text-textPrimary hover:bg-background/50'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 text-sm text-textMuted mb-2">
          <div className="w-8 h-8 rounded-full bg-background border border-primary flex items-center justify-center text-primary font-serif">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <span className="truncate">{user?.name}</span>
        </div>
        
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 w-full text-sm uppercase tracking-wider text-textMuted hover:text-primary transition-colors"
        >
          <Store className="w-4 h-4" />
          Back to Shop
        </Link>

        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-sm uppercase tracking-wider text-textMuted hover:text-error transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
