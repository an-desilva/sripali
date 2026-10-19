'use client';

import React, { useState } from 'react';
import { Card, Input, Button, Badge } from '@sripalie/ui';
import { Calendar, Clock, CheckCircle2, Eye } from 'lucide-react';

export default function AppointmentsPage() {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          phone,
          appointmentDate,
          timeSlot,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Booking failed.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error scheduling appointment.');
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-3 mb-10">
        <Badge variant="burgundy" className="py-1 px-3">SRIPALIE OPTOMETRY CLINIC</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Book Your Computerized Eye Test</h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Schedule an in-store refraction examination with our certified optometrist.
        </p>
      </div>

      {isSuccess ? (
        <Card className="text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Appointment Confirmed!</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Thank you {patientName}. Your eye test booking for <span className="font-bold text-slate-900 dark:text-white">{appointmentDate} at {timeSlot}</span> has been received.
          </p>
          <Button onClick={() => setIsSuccess(false)} className="bg-[#7A1D28] hover:bg-[#5E161F]">
            Book Another Exam
          </Button>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Patient Full Name"
                type="text"
                placeholder="John Doe"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />

              <Input
                label="Phone Number (WhatsApp)"
                type="tel"
                placeholder="+94 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Preferred Exam Date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Additional Notes / Eye Symptoms (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Frequent headaches, blurriness reading digital screens..."
                className="w-full p-3 border rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <Button type="submit" isLoading={isLoading} size="lg" className="w-full bg-[#7A1D28] hover:bg-[#5E161F]">
              Confirm Eye Exam Booking
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
