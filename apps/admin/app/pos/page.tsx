'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Badge } from '@sripalie/ui';
import { ShoppingCart, Glasses, User, Printer, CheckCircle2, Calculator } from 'lucide-react';
import { IProduct, IOrder } from '@sripalie/types';
import { InvoicePrintModal } from '../../components/InvoicePrintModal';
import { adminFetch } from '../../lib/api';

export default function POSPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Patient Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Refraction Eye Power
  const [sphereOD, setSphereOD] = useState<number>(0);
  const [sphereOS, setSphereOS] = useState<number>(0);
  const [cylinderOD, setCylinderOD] = useState<number>(0);
  const [cylinderOS, setCylinderOS] = useState<number>(0);
  const [axisOD, setAxisOD] = useState<number>(0);
  const [axisOS, setAxisOS] = useState<number>(0);
  const [addPower, setAddPower] = useState<number>(0);
  const [pd, setPd] = useState<number>(63);

  // Lens & Payment
  const [lensType, setLensType] = useState<'single-vision' | 'bifocal' | 'progressive' | 'blue-cut'>('single-vision');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [advancePaid, setAdvancePaid] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<IOrder | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/products')
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
          setSelectedProduct(data[0]);
        }
      })
      .catch((err) => console.error('Error fetching POS products', err));
  }, []);

  const getLensPrice = (type: string) => {
    switch (type) {
      case 'single-vision': return 30;
      case 'bifocal': return 50;
      case 'progressive': return 90;
      case 'blue-cut': return 65;
      default: return 30;
    }
  };

  const framePrice = selectedProduct ? selectedProduct.price : 0;
  const lensPrice = getLensPrice(lensType);
  const totalAmount = framePrice + lensPrice;
  const balanceDue = Math.max(0, totalAmount - advancePaid);

  const handleCreateWalkInOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedProduct) {
      setError('Patient name, phone, and frame selection are required.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await adminFetch('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: [
            {
              productId: selectedProduct._id,
              framePrice,
              lensType,
              lensPrice,
              prescriptionData: {
                sphere_OD: sphereOD,
                sphere_OS: sphereOS,
                cylinder_OD: cylinderOD,
                cylinder_OS: cylinderOS,
                axis_OD: axisOD,
                axis_OS: axisOS,
                add_power: addPower,
                pupillaryDistance: pd,
              },
            },
          ],
          advancePaid: Number(advancePaid),
          paymentMethod,
          isWalkIn: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'POS order creation failed.');
      }

      setCreatedOrder(data);
      setIsPrintModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Error processing POS order.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="burgundy" className="mb-2">SINGLE-OPERATOR CLINIC WORKFLOW</Badge>
        <h1 className="text-3xl font-extrabold text-white">All-in-One Walk-in POS Console</h1>
        <p className="text-xs text-slate-400 mt-1">Eye Test Refraction + Frame & Lens Selection + Thermal Invoice Printing</p>
      </div>

      <form onSubmit={handleCreateWalkInOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* STEP 1: Patient Information */}
          <Card title="1. Patient Walk-in Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Patient Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Patient Name"
                required
              />
              <Input
                label="WhatsApp Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+94 77 123 4567"
                required
              />
            </div>
          </Card>

          {/* STEP 2: Optometry Refraction Power */}
          <Card title="2. Eye Examination Refraction (Optometry)">
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-xs text-left border-collapse border border-slate-800">
                <thead>
                  <tr className="bg-slate-800 text-slate-200">
                    <th className="p-2 border border-slate-700">Eye</th>
                    <th className="p-2 border border-slate-700">SPH (Sphere)</th>
                    <th className="p-2 border border-slate-700">CYL (Cylinder)</th>
                    <th className="p-2 border border-slate-700">AXIS</th>
                    <th className="p-2 border border-slate-700">ADD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-700 font-bold text-rose-400">Right Eye (OD)</td>
                    <td className="p-1 border border-slate-700">
                      <input type="number" step="0.25" value={sphereOD} onChange={(e) => setSphereOD(parseFloat(e.target.value) || 0)} className="w-full p-1 bg-slate-900 border rounded text-xs" />
                    </td>
                    <td className="p-1 border border-slate-700">
                      <input type="number" step="0.25" value={cylinderOD} onChange={(e) => setCylinderOD(parseFloat(e.target.value) || 0)} className="w-full p-1 bg-slate-900 border rounded text-xs" />
                    </td>
                    <td className="p-1 border border-slate-700">
                      <input type="number" value={axisOD} onChange={(e) => setAxisOD(parseInt(e.target.value) || 0)} className="w-full p-1 bg-slate-900 border rounded text-xs" />
                    </td>
                    <td className="p-1 border border-slate-700" rowSpan={2}>
                      <input type="number" step="0.25" value={addPower} onChange={(e) => setAddPower(parseFloat(e.target.value) || 0)} className="w-full p-1 bg-slate-900 border rounded text-xs" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-700 font-bold text-rose-400">Left Eye (OS)</td>
                    <td className="p-1 border border-slate-700">
                      <input type="number" step="0.25" value={sphereOS} onChange={(e) => setSphereOS(parseFloat(e.target.value) || 0)} className="w-full p-1 bg-slate-900 border rounded text-xs" />
                    </td>
                    <td className="p-1 border border-slate-700">
                      <input type="number" step="0.25" value={cylinderOS} onChange={(e) => setCylinderOS(parseFloat(e.target.value) || 0)} className="w-full p-1 bg-slate-900 border rounded text-xs" />
                    </td>
                    <td className="p-1 border border-slate-700">
                      <input type="number" value={axisOS} onChange={(e) => setAxisOS(parseInt(e.target.value) || 0)} className="w-full p-1 bg-slate-900 border rounded text-xs" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-48">
              <label className="text-xs font-semibold text-slate-300 block mb-1">PD (Pupillary Distance mm)</label>
              <input
                type="number"
                value={pd}
                onChange={(e) => setPd(parseInt(e.target.value) || 63)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-xs"
              />
            </div>
          </Card>

          {/* STEP 3: Frame & Lens Selection */}
          <Card title="3. Frame & Lens Selection">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Select Optical Frame</label>
                <select
                  value={selectedProduct?._id || ''}
                  onChange={(e) => {
                    const prod = products.find((p) => p._id === e.target.value);
                    if (prod) setSelectedProduct(prod);
                  }}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white"
                >
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.brand} - {p.modelCode}) — ${p.price.toFixed(2)} [Stock: {p.stockCount}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Select Lens Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'single-vision', label: 'Single Vision', price: 30 },
                    { id: 'blue-cut', label: 'Blue-Cut Digital', price: 65 },
                    { id: 'bifocal', label: 'Bifocal Executive', price: 50 },
                    { id: 'progressive', label: 'HD Progressive', price: 90 },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLensType(l.id as any)}
                      className={`p-3 rounded-xl border text-xs text-left transition-all ${
                        lensType === l.id
                          ? 'border-[#7A1D28] bg-[#7A1D28]/20 font-bold text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <p className="font-bold">{l.label}</p>
                      <p className="text-[10px] text-rose-400 mt-0.5">+${l.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Billing Summary & Thermal Receipt Print */}
        <div className="space-y-6">
          <Card title="Billing & POS Calculation">
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Selected Frame</span>
                <span className="font-bold text-white">${framePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Selected Lens ({lensType})</span>
                <span className="font-bold text-white">${lensPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-white pt-1">
                <span>Total Bill Amount</span>
                <span className="text-[#7A1D28] text-lg">${totalAmount.toFixed(2)}</span>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <Input
                  label="Advance Collected ($)"
                  type="number"
                  min="0"
                  max={totalAmount}
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)}
                />

                <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Outstanding Balance Due</span>
                  <span className="text-rose-400 text-sm">${balanceDue.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-300 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['cash', 'card', 'online'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m as any)}
                      className={`py-2 rounded-lg text-xs font-bold uppercase ${
                        paymentMethod === m
                          ? 'bg-[#7A1D28] text-white'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                size="lg"
                className="w-full bg-[#7A1D28] hover:bg-[#5E161F] mt-4 py-3"
              >
                <Printer className="w-4 h-4 mr-2" />
                Submit & Print Thermal Receipt
              </Button>
            </div>
          </Card>
        </div>
      </form>

      {/* Invoice Thermal Print Modal */}
      <InvoicePrintModal
        order={createdOrder}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
}
