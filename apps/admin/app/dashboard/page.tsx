'use client';

import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@sripalie/ui';
import { DollarSign, ShoppingBag, Clock, CheckCircle2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { OrderVolumeChart } from '../../components/charts/OrderVolumeChart';
import { IAnalyticsOverview } from '@sripalie/types';
import { adminFetch } from '../../lib/api';

export default function DashboardPage() {
  const [range, setRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [analytics, setAnalytics] = useState<IAnalyticsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchAnalytics = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);
    setError('');

    try {
      const res = await adminFetch(`/admin/analytics/overview?range=${range}`);

      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || `Failed to fetch analytics (${res.status})`);
      }
    } catch (err: any) {
      setError(err.message || 'Cannot reach API backend server on port 5000.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const handleAuthSuccess = () => fetchAnalytics(true);
    window.addEventListener('admin_auth_success', handleAuthSuccess);

    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 15000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('admin_auth_success', handleAuthSuccess);
    };
  }, [range]);

  return (
    <div className="space-y-8">
      {/* Header & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="burgundy" className="mb-2">FINANCIAL REPORTING & METRICS</Badge>
          <h1 className="text-3xl font-extrabold text-white">Clinic Analytics Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time revenue, advance collection, and order status breakdown</p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {(['day', 'week', 'month', 'year'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                range === r
                  ? 'bg-[#7A1D28] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {r === 'day' ? 'Today' : r === 'week' ? 'This Week' : r === 'month' ? 'This Month' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-300 text-xs flex items-center justify-between">
          <span><strong>API Error:</strong> {error}</span>
          <button onClick={() => fetchAnalytics()} className="underline font-bold ml-4 hover:text-white">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#7A1D28] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Computing Aggregated Analytics...</p>
        </div>
      ) : analytics ? (
        <>
          {/* Metrics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Gross Sales</span>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    ${analytics.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#7A1D28]/30 border border-[#7A1D28]/40 flex items-center justify-center text-rose-400">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Advance Collected</span>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                    ${analytics.totalAdvanceCollected.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Outstanding Balance Due</span>
                  <p className="text-2xl font-extrabold text-rose-500 mt-1">
                    ${analytics.totalBalanceDue.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Total Spectacle Orders</span>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    {analytics.totalOrders}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Card title="Financial Revenue Stream" subtitle="Gross Sales vs Advance Collected vs Outstanding Balance">
                <RevenueChart data={analytics.chartData} />
              </Card>
            </div>

            <div className="space-y-4">
              <Card title="Spectacle Order Volume" subtitle="Number of orders placed over timeframe">
                <OrderVolumeChart data={analytics.chartData} />
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
