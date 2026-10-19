'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Card, Input, Button, Badge } from '@sripalie/ui';
import { Eye, ShieldCheck, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      // Unified Login: store token and user role
      login(data.token, data.user);

      if (data.user.role === 'admin') {
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';
        // Redirect to admin portal and pass token for origin bridge
        window.location.href = `${adminUrl}/dashboard?token=${encodeURIComponent(data.token)}&user=${encodeURIComponent(JSON.stringify(data.user))}`;
      } else {
        router.push('/catalog');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#7A1D28] text-white flex items-center justify-center mx-auto shadow-lg">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Unified Portal Sign In</h2>
          <p className="text-xs text-slate-500">
            Sign in to access your customer optical history or Administrator Clinic Portal.
          </p>
        </div>

        <Card>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com or admin@sripalie.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" isLoading={isLoading} className="w-full bg-[#7A1D28] hover:bg-[#5E161F]">
              Sign In to Account
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-[#7A1D28] hover:underline">
              Create Customer Account
            </Link>
          </div>
        </Card>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs space-y-2 border border-slate-800">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Default Admin Credentials:</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Email: admin@sripalie.com | Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}
