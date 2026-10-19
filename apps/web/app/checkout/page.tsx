'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Card, Input, Button, Badge } from '@sripalie/ui';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, user, clearCart } = useAuth();

  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerPhone, setCustomerPhone] = useState(user ? user.phone : '');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [advancePaid, setAdvancePaid] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');

  const totalAmount = cart.reduce((acc, item) => acc + item.product.price + item.lensPrice, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setError('');
    setIsLoading(true);

    try {
      const itemsPayload = cart.map((item) => ({
        productId: item.product._id,
        framePrice: item.product.price,
        lensType: item.lensType,
        lensPrice: item.lensPrice,
        prescriptionData: item.prescriptionData || {},
      }));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: itemsPayload,
          advancePaid: Number(advancePaid),
          paymentMethod,
          isWalkIn: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Order submission failed.');
      }

      setOrderNumber(data.orderNumber);
      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Error processing checkout.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <Badge variant="burgundy" className="py-1 px-3">ORDER CONFIRMED</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Order {orderNumber} Placed!</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Thank you {customerName}. Your spectacle order is now being processed. You will receive a WhatsApp message when your spectacles are ready for collection.
        </p>
        <Button onClick={() => router.push('/catalog')} className="bg-[#7A1D28] hover:bg-[#5E161F]">
          Return to Storefront
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Complete Optical Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  1. Customer Contact Details
                </h3>

                <Input
                  label="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />

                <Input
                  label="Phone Number (for WhatsApp Alerts)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  2. Payment Method & Advance
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {['cash', 'card', 'online'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method as any)}
                      className={`p-3 rounded-lg border text-xs font-bold capitalize transition-all ${
                        paymentMethod === method
                          ? 'border-[#7A1D28] bg-rose-50 text-[#7A1D28] dark:bg-[#7A1D28]/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                <Input
                  label={`Advance Payment Amount ($) [Total: $${totalAmount.toFixed(2)}]`}
                  type="number"
                  min="0"
                  max={totalAmount}
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)}
                  helperText="You can pay partial advance now and balance upon pickup."
                />
              </div>

              <Button type="submit" isLoading={isLoading} size="lg" className="w-full bg-[#7A1D28] hover:bg-[#5E161F]">
                Confirm & Place Order
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card title="Summary">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span>Items Count</span>
                <span className="font-bold">{cart.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-bold text-[#7A1D28]">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Advance Paid Now</span>
                <span className="font-bold text-emerald-600">${Number(advancePaid).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-sm">
                <span>Balance Due at Pickup</span>
                <span className="text-rose-600">${Math.max(0, totalAmount - Number(advancePaid)).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
