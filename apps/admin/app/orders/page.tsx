'use client';

import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Input } from '@sripalie/ui';
import { ShoppingBag, MessageSquare, Printer, CheckCircle2, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { IOrder } from '@sripalie/types';
import { InvoicePrintModal } from '../../components/InvoicePrintModal';
import { adminFetch } from '../../lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<IOrder | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const fetchOrders = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);
    setError('');

    try {
      const endpoint = statusFilter !== 'all' ? `/orders/all?status=${statusFilter}` : `/orders/all`;
      const res = await adminFetch(endpoint);

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || `Failed to fetch orders (${res.status})`);
      }
    } catch (err: any) {
      setError(err.message || 'Cannot reach API backend server on port 5000.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleAuthSuccess = () => fetchOrders(true);
    window.addEventListener('admin_auth_success', handleAuthSuccess);

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('admin_auth_success', handleAuthSuccess);
    };
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await adminFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (res.ok) {
        fetchOrders(true);
      }
    } catch (err) {
      console.error('Error updating order status');
    }
  };

  const handleCollectPayment = async (orderId: string, amount: number) => {
    try {
      const res = await adminFetch(`/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additionalPaid: amount }),
      });

      if (res.ok) {
        fetchOrders(true);
      }
    } catch (err) {
      console.error('Error collecting payment');
    }
  };

  const generateWhatsAppLink = (order: IOrder) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${order.customerName}, your spectacles (Order ${order.orderNumber}) at SRIPALIE OPTICALS are ready for pickup! Outstanding balance due: $${order.balanceDue.toFixed(2)}. Store Address: 124 Main Street. Thank you!`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="burgundy" className="mb-2">ORDER MANAGEMENT & DISPENSING</Badge>
          <h1 className="text-3xl font-extrabold text-white">Spectacle Orders</h1>
          <p className="text-xs text-slate-400 mt-1">Status tracking, WhatsApp customer alerts, and thermal invoice printing</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-white p-2.5 rounded-xl font-medium"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => fetchOrders()}
            disabled={loading || isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-300 text-xs flex items-center justify-between">
          <span><strong>API Error:</strong> {error}</span>
          <button onClick={() => fetchOrders()} className="underline font-bold ml-4 hover:text-white">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#7A1D28] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Loading Spectacle Orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="text-center py-16 text-xs text-slate-500 bg-slate-900 border-slate-800">
          No spectacle orders found.
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <Card key={ord._id} className="bg-slate-900 border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-lg text-rose-400">{ord.orderNumber}</span>
                    {ord.isWalkIn && <Badge variant="burgundy">Walk-in POS</Badge>}
                  </div>
                  <p className="text-xs text-slate-300 font-bold mt-0.5">
                    Customer: {ord.customerName} ({ord.customerPhone})
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Placed: {new Date(ord.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Dropdown */}
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {/* 1-Click WhatsApp Alert Button */}
                  <a
                    href={generateWhatsAppLink(ord)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Alert</span>
                  </a>

                  {/* Thermal Invoice Print Button */}
                  <button
                    onClick={() => {
                      setSelectedOrderForPrint(ord);
                      setIsPrintModalOpen(true);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Items & Financials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-400">Items & Lens Type:</p>
                  {ord.items.map((item, i) => (
                    <div key={i} className="text-slate-300">
                      • Frame (${item.framePrice}) + Lens: {item.lensType} (${item.lensPrice})
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-slate-400">Financial Summary:</p>
                  <p className="text-slate-300">Total Bill: ${ord.totalAmount.toFixed(2)}</p>
                  <p className="text-emerald-400">Advance Paid: ${ord.advancePaid.toFixed(2)}</p>
                  <p className="text-rose-400 font-bold">Balance Due: ${ord.balanceDue.toFixed(2)}</p>
                </div>

                {/* Balance Collection */}
                {ord.balanceDue > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleCollectPayment(ord._id, ord.balanceDue)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs w-full"
                    >
                      <DollarSign className="w-3.5 h-3.5 mr-1" /> Clear Outstanding Balance (${ord.balanceDue})
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Invoice Print Modal */}
      <InvoicePrintModal
        order={selectedOrderForPrint}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
}
