'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge } from '@sripalie/ui';
import { ShoppingBag, Trash2, Glasses, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useAuth();

  const totalAmount = cart.reduce((acc, item) => acc + item.product.price + item.lensPrice, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Badge variant="burgundy" className="mb-1">Dispensary Checkout</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-[#7A1D28]" />
            Your Eyewear Order Cart
          </h1>
        </div>
        {cart.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-600">
            Clear Cart
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <Card className="text-center py-16 space-y-4">
          <Glasses className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your optical cart is empty</h3>
          <p className="text-xs text-slate-500">Explore our frame catalog to configure custom prescription lenses.</p>
          <Link href="/catalog">
            <Button className="bg-[#7A1D28] hover:bg-[#5E161F] mt-2">
              Browse Eyewear Catalog
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <Card key={index} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80'}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-lg bg-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{item.product.title}</h4>
                    <p className="text-xs text-slate-500">{item.product.brand} • {item.product.shape}</p>
                    <div className="mt-1">
                      <Badge variant="burgundy" className="capitalize text-[10px]">
                        Lens: {item.lensType.replace('-', ' ')} (+${item.lensPrice})
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Subtotal</span>
                    <span className="font-extrabold text-lg text-[#7A1D28]">
                      ${(item.product.price + item.lensPrice).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card title="Order Summary">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Frames Subtotal</span>
                  <span>${cart.reduce((acc, i) => acc + i.product.price, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Prescription Lenses Subtotal</span>
                  <span>${cart.reduce((acc, i) => acc + i.lensPrice, 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-extrabold text-base text-slate-900 dark:text-white">
                  <span>Total Order Amount</span>
                  <span className="text-[#7A1D28]">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/checkout">
                  <Button className="w-full bg-[#7A1D28] hover:bg-[#5E161F] py-3 text-base">
                    Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
