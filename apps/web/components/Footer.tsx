import React from 'react';
import Link from 'next/link';
import { Eye, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#7A1D28] flex items-center justify-center text-white font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                SRIPALIE <span className="text-rose-500">OPTICALS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Premier optical store and optometry eye clinic delivering high-precision prescription lenses, designer frames, and comprehensive eye health examinations.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Optometry & Precision Lenses</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/catalog" className="hover:text-white transition-colors">Eyewear Catalog</Link></li>
              <li><Link href="/appointments" className="hover:text-white transition-colors">Book Eye Exam</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">My Shopping Cart</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Customer Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4">Lens & Eye Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Single Vision Prescription Lenses</li>
              <li>Blue-Cut Computer Armor Lenses</li>
              <li>HD Progressive No-Line Lenses</li>
              <li>Bifocal Executive Lenses</li>
              <li>Glaucoma & Refractive Screening</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4">Store Clinic Location</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7A1D28] shrink-0 mt-0.5" />
                <span>124 Main Street, Optical Medical Complex, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7A1D28] shrink-0" />
                <span>+94 11 234 5678 / +94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7A1D28] shrink-0" />
                <span>clinic@sripalie.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SRIPALIE OPTICALS. All rights reserved. Built with Next.js 14, Tailwind CSS & Express.
        </div>
      </div>
    </footer>
  );
};
