'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Glasses,
  ShoppingBag,
  Calendar,
  ShieldAlert,
  ExternalLink,
  Eye,
  LogOut,
} from 'lucide-react';

export const AdminNav: React.FC = () => {
  const pathname = usePathname();
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

  const navItems = [
    { name: 'Analytics Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'POS Walk-in Console', href: '/pos', icon: ShoppingCart, highlight: true },
    { name: 'Inventory & Frames', href: '/inventory', icon: Glasses },
    { name: 'Spectacle Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Clinic Appointments', href: '/appointments', icon: Calendar },
    { name: 'Security Control Center', href: '/security', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7A1D28] text-white flex items-center justify-center font-bold shadow-lg">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight">
              SRIPALIE <span className="text-rose-500">ADMIN</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Single-Operator Clinic Console</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#7A1D28] text-white shadow-md shadow-[#7A1D28]/30'
                    : item.highlight
                    ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <a
          href={webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
        >
          <span>Open Public Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={() => {
            localStorage.removeItem('sripalie_token');
            localStorage.removeItem('sripalie_user');
            window.location.href = `${webUrl}/login`;
          }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-950/40 text-red-400 border border-red-900/50 text-xs font-bold hover:bg-red-900/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </aside>
  );
};
