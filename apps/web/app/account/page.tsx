'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Badge, Button } from '@sripalie/ui';
import { User, Glasses, Calendar, FileText } from 'lucide-react';
import { IOrder, IPrescription } from '@sripalie/types';

export default function AccountPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'prescriptions'>('orders');

  useEffect(() => {
    if (!token) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Fetch user orders
    fetch(`${apiUrl}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok && res.json())
      .then((data) => data && setOrders(data))
      .catch(() => {});

    // Fetch user prescriptions
    fetch(`${apiUrl}/prescriptions/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok && res.json())
      .then((data) => data && setPrescriptions(data))
      .catch(() => {});
  }, [token]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">Please Log In</h2>
        <p className="text-xs text-slate-500">Sign in to view your prescription records and spectacle order history.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Profile Banner */}
      <Card className="bg-gradient-to-r from-slate-900 to-[#7A1D28] text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center font-extrabold text-2xl text-rose-300">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-xs text-rose-200">{user.email} • {user.phone}</p>
            <Badge variant="burgundy" className="mt-2 text-[10px] bg-white/20 border-white/30 text-white">
              Customer Account
            </Badge>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-[#7A1D28] text-[#7A1D28]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Glasses className="w-4 h-4" />
          Spectacle Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'prescriptions'
              ? 'border-[#7A1D28] text-[#7A1D28]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Stored Eye Prescriptions ({prescriptions.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card className="text-center py-12 text-xs text-slate-500">No past orders found.</Card>
          ) : (
            orders.map((ord) => (
              <Card key={ord._id}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                  <div>
                    <span className="font-extrabold text-[#7A1D28] text-base">{ord.orderNumber}</span>
                    <span className="text-xs text-slate-400 block">
                      Placed on {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge
                    variant={
                      ord.orderStatus === 'Completed'
                        ? 'success'
                        : ord.orderStatus === 'Ready for Pickup'
                        ? 'warning'
                        : 'burgundy'
                    }
                  >
                    {ord.orderStatus}
                  </Badge>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Items: {ord.items.length} frame(s)</p>
                    <p className="text-slate-500">Advance Paid: ${ord.advancePaid} | Balance Due: ${ord.balanceDue}</p>
                  </div>
                  <span className="font-bold text-base text-slate-900 dark:text-white">${ord.totalAmount.toFixed(2)}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <Card className="text-center py-12 text-xs text-slate-500">No saved prescriptions found.</Card>
          ) : (
            prescriptions.map((p) => (
              <Card key={p._id} title={`Prescription - ${p.patientName}`}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">SPH (OD/OS)</span>
                    <span className="font-bold">{p.sphere_OD} / {p.sphere_OS}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">CYL (OD/OS)</span>
                    <span className="font-bold">{p.cylinder_OD} / {p.cylinder_OS}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">AXIS (OD/OS)</span>
                    <span className="font-bold">{p.axis_OD}° / {p.axis_OS}°</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">PD (Pupillary Dist)</span>
                    <span className="font-bold">{p.pupillaryDistance} mm</span>
                  </div>
                </div>

                {p.prescriptionFileUrl && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={p.prescriptionFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#7A1D28] hover:underline"
                    >
                      📄 View Attached Doctor Slip Image (AWS S3)
                    </a>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
