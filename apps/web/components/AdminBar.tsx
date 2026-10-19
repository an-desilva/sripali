'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, ExternalLink, Lock } from 'lucide-react';

export const AdminBar: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return null;
  }

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-amber-500/30 px-4 py-2 text-xs flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <div className="flex items-center gap-1.5 font-semibold tracking-wider text-amber-400">
          <Shield className="w-3.5 h-3.5" />
          <span>ADMINISTRATOR SESSION ACTIVE</span>
        </div>
        <span className="text-slate-400 hidden sm:inline">|</span>
        <span className="text-slate-300 hidden sm:inline">Logged in as {user.name} ({user.email})</span>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={adminUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-[#7A1D28] hover:bg-[#5E161F] text-white px-3 py-1 rounded font-medium transition-colors border border-rose-500/30"
        >
          <span>Open Clinic Admin Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
