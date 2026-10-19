'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IProduct } from '@sripalie/types';
import { Button, Card, Badge } from '@sripalie/ui';
import { Eye, ShieldCheck, Glasses, Calendar, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LensConfiguratorModal } from '../components/LensConfiguratorModal';

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load products');
      }
    };
    fetchProducts();
  }, []);

  const handleOpenLensModal = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-[#420E15] text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#7A1D28]/30 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="burgundy" className="py-1 px-3 text-xs uppercase tracking-widest bg-[#7A1D28]/40 border border-[#7A1D28]">
              Precision Optometry & Luxury Eyewear
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Clarity Reimagined. <br />
              <span className="bg-gradient-to-r from-rose-400 via-amber-200 to-rose-200 bg-clip-text text-transparent">
                SRIPALIE OPTICALS
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
              Experience medical-grade precision optical care and curated global frame collections. From computerized refractive testing to custom blue-cut digital lenses.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/catalog">
                <Button size="lg" className="bg-[#7A1D28] hover:bg-[#5E161F] text-white px-8 shadow-lg shadow-[#7A1D28]/30">
                  Explore Catalog <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/appointments">
                <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                  <Calendar className="w-5 h-5 mr-2 text-rose-400" />
                  Book Eye Exam
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800 text-xs">
              <div>
                <p className="font-extrabold text-xl text-white">100%</p>
                <p className="text-slate-400">Certified UV Protection</p>
              </div>
              <div>
                <p className="font-extrabold text-xl text-white">Same-Day</p>
                <p className="text-slate-400">Walk-in POS Testing</p>
              </div>
              <div>
                <p className="font-extrabold text-xl text-white">AWS S3</p>
                <p className="text-slate-400">Digital Prescription Storage</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80"
                alt="Optical Frames Display"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Ray-Ban Aviator Classic Titanium</h3>
                    <p className="text-xs text-rose-400 font-semibold">$185.00 + Custom Lens Options</p>
                  </div>
                  <Badge variant="burgundy">Featured</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <Badge variant="burgundy" className="mb-2">Selected Collection</Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Featured Eyewear</h2>
            <p className="text-slate-500 text-sm mt-1">Hand-crafted frames with prescription lens configurator</p>
          </div>
          <Link href="/catalog" className="text-sm font-bold text-[#7A1D28] hover:underline flex items-center gap-1 mt-4 md:mt-0">
            View All Frames →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <Card key={prod._id} className="group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative h-48 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                  <img
                    src={prod.images[0] || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {prod.gender}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#7A1D28] transition-colors">
                  {prod.title}
                </h3>
                <p className="text-xs text-slate-500 mb-2">{prod.brand} • {prod.shape}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Frame Price</span>
                  <p className="font-extrabold text-lg text-[#7A1D28]">${prod.price.toFixed(2)}</p>
                </div>
                <Button size="sm" onClick={() => handleOpenLensModal(prod)} className="bg-[#7A1D28] hover:bg-[#5E161F]">
                  <Glasses className="w-4 h-4 mr-1" /> Configure Lens
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold">Complete Optical & Clinic Solutions</h2>
            <p className="text-slate-400 text-sm">
              Single-operator clinic workflow integrated with high-precision optical dispensary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#7A1D28] flex items-center justify-center text-white">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Computerized Refraction</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Comprehensive eye test measuring Sphere, Cylinder, Axis, and Pupillary Distance with instant digital prescription recording.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#7A1D28] flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Blue-Cut & HD Progressive Lenses</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Specialized digital anti-glare lens coatings for programmers, office professionals, and multifocal visual clarity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#7A1D28] flex items-center justify-center text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">1-Click WhatsApp Ready Notification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Single-operator admin updates spectacle order status to "Ready for Pickup" and instantly sends automated WhatsApp notification with balance due.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lens Configurator Modal */}
      <LensConfiguratorModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
