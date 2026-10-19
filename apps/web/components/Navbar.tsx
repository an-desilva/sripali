'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Eye, User as UserIcon, ShieldAlert, Calendar, LogOut } from 'lucide-react';
import { AdminBar } from './AdminBar';

export const Navbar: React.FC = () => {
  const { user, logout, cart } = useAuth();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';

  return (
    <>
      <AdminBar />
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#7A1D28] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  SRIPALIE <span className="text-[#7A1D28]">OPTICALS</span>
                </span>
                <p className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
                  Medical Eyewear & Clinic
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/catalog" className="text-slate-700 dark:text-slate-300 hover:text-[#7A1D28] transition-colors">
                Eyewear Catalog
              </Link>
              <Link href="/appointments" className="text-slate-700 dark:text-slate-300 hover:text-[#7A1D28] transition-colors flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#7A1D28]" />
                Book Eye Clinic Test
              </Link>
              {user && (
                <Link href="/account" className="text-slate-700 dark:text-slate-300 hover:text-[#7A1D28] transition-colors">
                  My Prescriptions
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Conditional Admin Panel Badge/Button if role === 'admin' */}
              {user?.role === 'admin' && (
                <a
                  href={adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-all"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Admin Panel</span>
                </a>
              )}

              {/* Cart Icon */}
              <Link href="/cart" className="relative p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7A1D28] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                    {cart.length}
                  </span>
                )}
              </Link>

              {/* User Account / Auth */}
              {user ? (
                <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={logout}
                    title="Log Out"
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-[#7A1D28] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5E161F] transition-all shadow-sm"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
