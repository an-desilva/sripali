'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Badge, Modal } from '@sripalie/ui';
import { Glasses, Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { IProduct } from '@sripalie/types';
import { adminFetch } from '../../lib/api';

export default function InventoryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [modelCode, setModelCode] = useState('');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex' | 'kids'>('unisex');
  const [shape, setShape] = useState<'rectangle' | 'round' | 'cat-eye' | 'aviator' | 'square'>('rectangle');
  const [material, setMaterial] = useState('Titanium');
  const [price, setPrice] = useState<number>(150);
  const [stockCount, setStockCount] = useState<number>(10);
  const [imageUrl, setImageUrl] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();

    const handleAuth = () => fetchInventory();
    window.addEventListener('admin_auth_success', handleAuth);
    return () => window.removeEventListener('admin_auth_success', handleAuth);
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          brand,
          modelCode,
          gender,
          shape,
          material,
          price: Number(price),
          stockCount: Number(stockCount),
          images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'],
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchInventory();
        // Reset form
        setTitle('');
        setBrand('');
        setModelCode('');
      }
    } catch (err) {
      console.error('Error creating product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this frame from inventory?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('sripalie_token') : null;
      await fetch(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      fetchInventory();
    } catch (err) {
      console.error('Error deleting product');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="burgundy" className="mb-2">STOCK & DISPENSARY MANAGEMENT</Badge>
          <h1 className="text-3xl font-extrabold text-white">Inventory & Frames</h1>
          <p className="text-xs text-slate-400 mt-1">Manage optical frame stock, model codes, and pricing</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="bg-[#7A1D28] hover:bg-[#5E161F]">
          <Plus className="w-4 h-4 mr-2" /> Add New Optical Frame
        </Button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#7A1D28] animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Loading Inventory Stock...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p._id} className="bg-slate-900 border-slate-800 flex flex-col justify-between">
              <div>
                <div className="relative h-40 rounded-lg overflow-hidden bg-slate-800 mb-4">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {p.gender} • {p.shape}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base">{p.title}</h3>
                <p className="text-xs text-slate-400">Brand: {p.brand} | Model: {p.modelCode}</p>
                <p className="text-xs text-slate-400 mt-1">Material: {p.material}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Stock: {p.stockCount} units</span>
                  <span className="font-extrabold text-lg text-rose-400">${p.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleDeleteProduct(p._id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Frame Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Optical Frame" maxWidth="lg">
        <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
          <Input label="Frame Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
            <Input label="Model Code" value={modelCode} onChange={(e) => setModelCode(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Gender Category</label>
              <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full p-2 bg-slate-800 border rounded text-xs">
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
                <option value="kids">Kids</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Frame Shape</label>
              <select value={shape} onChange={(e) => setShape(e.target.value as any)} className="w-full p-2 bg-slate-800 border rounded text-xs">
                <option value="rectangle">Rectangle</option>
                <option value="round">Round</option>
                <option value="cat-eye">Cat-Eye</option>
                <option value="aviator">Aviator</option>
                <option value="square">Square</option>
              </select>
            </div>
          </div>

          <Input label="Material" value={material} onChange={(e) => setMaterial(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price ($)" type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} required />
            <Input label="Stock Count" type="number" value={stockCount} onChange={(e) => setStockCount(parseInt(e.target.value) || 0)} required />
          </div>

          <Input label="Image URL (Unsplash or S3)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#7A1D28] hover:bg-[#5E161F]">Save Product</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
