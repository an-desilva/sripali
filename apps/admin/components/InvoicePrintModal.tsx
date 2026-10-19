'use client';

import React from 'react';
import { IOrder } from '@sripalie/types';
import { Modal, Button } from '@sripalie/ui';
import { Printer } from 'lucide-react';

interface InvoicePrintModalProps {
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receipt & Thermal Invoice" maxWidth="md">
      <div className="space-y-6">
        {/* Printable Section */}
        <div
          id="thermal-invoice-printable"
          className="p-6 bg-white text-slate-900 border border-slate-200 rounded-lg shadow-sm font-mono text-xs space-y-4"
        >
          <div className="text-center border-b border-dashed border-slate-400 pb-4">
            <h2 className="font-extrabold text-base tracking-tight">SRIPALIE OPTICALS</h2>
            <p className="text-[10px]">Medical Optometry & Optical Dispensary</p>
            <p className="text-[10px]">124 Main Street, Colombo | Tel: +94 11 234 5678</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Receipt No:</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{order.customerPhone}</span>
            </div>
          </div>

          <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-2">
            <p className="font-bold text-[10px] uppercase">Optical Items Breakdown</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="space-y-1 text-[11px]">
                <div className="flex justify-between font-semibold">
                  <span>Spectacle Frame</span>
                  <span>${item.framePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 pl-2">
                  <span>+ Lens: {item.lensType}</span>
                  <span>${item.lensPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between font-bold">
              <span>Total Gross Amount:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Advance Paid:</span>
              <span>${order.advancePaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-rose-700 font-extrabold text-sm pt-1 border-t border-slate-300">
              <span>Outstanding Balance Due:</span>
              <span>${order.balanceDue.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center border-t border-dashed border-slate-400 pt-3 text-[10px] text-slate-500">
            <p>Thank you for choosing SRIPALIE OPTICALS!</p>
            <p>Please retain this receipt for spectacles pickup.</p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-3 no-print">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} className="bg-[#7A1D28] hover:bg-[#5E161F]">
            <Printer className="w-4 h-4 mr-2" />
            Print Thermal Receipt (80mm)
          </Button>
        </div>
      </div>
    </Modal>
  );
};
