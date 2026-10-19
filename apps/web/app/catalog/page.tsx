'use client';

import React, { useState, useEffect } from 'react';
import { IProduct } from '@sripalie/types';
import { Card, Button, Badge, Input } from '@sripalie/ui';
import { Filter, Glasses, Search, RefreshCw } from 'lucide-react';
import { LensConfiguratorModal } from '../../components/LensConfiguratorModal';

export default function CatalogPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [shapeFilter, setShapeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected for Modal
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams();
      if (genderFilter !== 'all') params.append('gender', genderFilter);
      if (shapeFilter !== 'all') params.append('shape', shapeFilter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`${apiUrl}/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [genderFilter, shapeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Catalog Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Badge variant="burgundy" className="mb-2">Optical Dispensary</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Eyewear Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Select any frame to customize with prescription lenses</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
          <Input
            placeholder="Search frame model or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="bg-[#7A1D28] hover:bg-[#5E161F]">
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-[#7A1D28]" />
          <span>Filters:</span>
        </div>

        {/* Gender Filter */}
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="text-xs p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 font-medium"
        >
          <option value="all">All Genders</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
          <option value="kids">Kids</option>
        </select>

        {/* Shape Filter */}
        <select
          value={shapeFilter}
          onChange={(e) => setShapeFilter(e.target.value)}
          className="text-xs p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 font-medium"
        >
          <option value="all">All Frame Shapes</option>
          <option value="rectangle">Rectangle</option>
          <option value="round">Round</option>
          <option value="cat-eye">Cat-Eye</option>
          <option value="aviator">Aviator</option>
          <option value="square">Square</option>
        </select>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setGenderFilter('all');
            setShapeFilter('all');
            setSearchQuery('');
          }}
          className="text-xs"
        >
          Reset Filters
        </Button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#7A1D28] animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading Optical Catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Glasses className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No frames matched your search</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing filters or searching for another model.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((prod) => (
            <Card key={prod._id} className="group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative h-48 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                  <img
                    src={prod.images[0] || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {prod.gender}
                    </span>
                    <span className="bg-[#7A1D28]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {prod.shape}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#7A1D28] transition-colors">
                  {prod.title}
                </h3>
                <p className="text-xs text-slate-500 mb-1">Brand: {prod.brand} | Model: {prod.modelCode}</p>
                <p className="text-xs text-slate-400">Material: {prod.material}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Base Frame</span>
                  <p className="font-extrabold text-lg text-[#7A1D28]">${prod.price.toFixed(2)}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(prod);
                    setIsModalOpen(true);
                  }}
                  className="bg-[#7A1D28] hover:bg-[#5E161F]"
                >
                  <Glasses className="w-4 h-4 mr-1" /> Configure Lens
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lens Configurator Modal */}
      <LensConfiguratorModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
