import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdminNav } from '../components/AdminNav';
import { AdminAuthSync } from '../components/AdminAuthSync';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SRIPALIE OPTICALS - Clinic & Admin Portal',
  description: 'Single-Operator Optometry Clinic & Optical Store Administration Console',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        <AdminAuthSync />
        <div className="flex-1 flex overflow-hidden">
          <AdminNav />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
