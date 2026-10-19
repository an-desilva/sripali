'use client';

import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Input } from '@sripalie/ui';
import { ShoppingBag, MessageSquare, Printer, CheckCircle2, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { IOrder } from '@sripalie/types';
import { InvoicePrintModal } from '../../components/InvoicePrintModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<IOrder | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('sripalie_token') : null;
      const url = statusFilter !== 'all' ? `${apiUrl}/orders/all?status=${statusFilter}` : `${apiUrl}/orders/all`;

      const res = await fetch(url, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('sripalie_token') : null;

      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Error updating order status');
    }
  };

  const handleCollectPayment = async (orderId: string, amount: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('sripalie_token') : null;

      const res = await fetch(`${apiUrl}/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ additionalPaid: amount }),
      });

      if (res.ok) {
        fetchOrders();
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

        {/* Status Filter */}
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
      </div>

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
