'use client';

import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@sripalie/ui';
import { Calendar, Clock, CheckCircle2, User, RefreshCw } from 'lucide-react';
import { IAppointment } from '@sripalie/types';
import { adminFetch } from '../../lib/api';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchAppointments = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);
    setError('');

    try {
      const res = await adminFetch('/appointments');

      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || `Failed to fetch appointments (${res.status})`);
      }
    } catch (err: any) {
      setError(err.message || 'Cannot reach API backend server on port 5000.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const handleAuthSuccess = () => fetchAppointments(true);
    window.addEventListener('admin_auth_success', handleAuthSuccess);

    // Auto-refresh every 10 seconds so newly submitted appointments appear automatically
    const timer = setInterval(() => {
      fetchAppointments(true);
    }, 10000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('admin_auth_success', handleAuthSuccess);
    };
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminFetch(`/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      fetchAppointments(true);
    } catch (err) {
      console.error('Error updating appointment');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="burgundy" className="mb-2">OPTOMETRY CLINIC SCHEDULE</Badge>
          <h1 className="text-3xl font-extrabold text-white">Clinic Appointments</h1>
          <p className="text-xs text-slate-400 mt-1">Manage patient eye test bookings and consultation slots (Auto-refreshes live)</p>
        </div>

        <button
          onClick={() => fetchAppointments()}
          disabled={loading || isRefreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-300 text-xs flex items-center justify-between">
          <span><strong>API Error:</strong> {error}</span>
          <button onClick={() => fetchAppointments()} className="underline font-bold ml-4 hover:text-white">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#7A1D28] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Loading Clinic Bookings...</p>
        </div>
      ) : appointments.length === 0 ? (
        <Card className="text-center py-16 text-xs text-slate-500 bg-slate-900 border-slate-800">
          No appointment bookings scheduled.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((apt) => (
            <Card key={apt._id} className="bg-slate-900 border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7A1D28]/30 border border-[#7A1D28]/40 flex items-center justify-center text-rose-400 font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{apt.patientName}</h3>
                    <p className="text-xs text-slate-400">{apt.phone}</p>
                  </div>
                </div>

                <Badge
                  variant={
                    apt.status === 'completed'
                      ? 'success'
                      : apt.status === 'confirmed'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {apt.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span>Date: {apt.appointmentDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>Time Slot: {apt.timeSlot}</span>
                </div>
              </div>

              {apt.notes && (
                <p className="text-xs text-slate-400 bg-slate-850 p-2 rounded border border-slate-800">
                  Notes: {apt.notes}
                </p>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2 text-xs">
                <select
                  value={apt.status}
                  onChange={(e) => handleUpdateStatus(apt._id, e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                >
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
