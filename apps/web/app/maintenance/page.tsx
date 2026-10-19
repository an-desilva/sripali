import React from 'react';
import { AlertTriangle, Lock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-6 bg-slate-900 border border-red-500/30 p-8 rounded-2xl shadow-2xl">
        <div className="w-20 h-20 bg-red-950/60 border border-red-500/40 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-800">
            EMERGENCY THREAT LOCKDOWN ACTIVE
          </span>
          <h1 className="text-3xl font-extrabold text-white">Storefront Offline</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            SRIPALIE OPTICALS public store has been placed under temporary lockdown by system administrators. Public access and online orders are temporarily suspended.
          </p>
        </div>

        <div className="p-4 bg-slate-850 rounded-xl text-left border border-slate-800 text-xs text-slate-400 space-y-2">
          <p className="font-bold text-slate-300">Are you a Store Manager?</p>
          <p>Clinic Admin Console remains accessible for authorized personnel with valid administrator tokens.</p>
          <a
            href={adminUrl}
            className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 font-bold underline mt-1"
          >
            Access Clinic Admin Portal →
          </a>
        </div>
      </div>
    </div>
  );
}
