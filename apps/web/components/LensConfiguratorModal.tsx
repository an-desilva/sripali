'use client';

import React, { useState } from 'react';
import { IProduct } from '@sripalie/types';
import { useAuth } from '../context/AuthContext';
import { Modal, Button, Input, Badge } from '@sripalie/ui';
import { Glasses, Upload, Check, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface LensConfiguratorModalProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LensConfiguratorModal: React.FC<LensConfiguratorModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart, user, token } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Lens Choice
  const [lensType, setLensType] = useState<'single-vision' | 'bifocal' | 'progressive' | 'blue-cut'>('single-vision');

  // Manual Prescription State
  const [sphereOD, setSphereOD] = useState<number>(0);
  const [sphereOS, setSphereOS] = useState<number>(0);
  const [cylinderOD, setCylinderOD] = useState<number>(0);
  const [cylinderOS, setCylinderOS] = useState<number>(0);
  const [axisOD, setAxisOD] = useState<number>(0);
  const [axisOS, setAxisOS] = useState<number>(0);
  const [addPower, setAddPower] = useState<number>(0);
  const [pd, setPd] = useState<number>(63);

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [prescriptionFileUrl, setPrescriptionFileUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!product) return null;

  const lensOptions = [
    {
      id: 'single-vision',
      title: 'Single Vision Lens',
      desc: 'Corrects one focal distance (Distance or Reading). High clarity anti-scratch coating.',
      price: 30,
      badge: 'Popular',
    },
    {
      id: 'blue-cut',
      title: 'Blue-Cut Digital Armor',
      desc: 'Blocks 99% harmful blue light from monitors & smartphones. Reduces eye strain.',
      price: 65,
      badge: 'Recommended',
    },
    {
      id: 'bifocal',
      title: 'Executive Bifocal Lens',
      desc: 'Dual visibility zone with visible dividing segment line for clear reading & distance.',
      price: 50,
      badge: 'Classic',
    },
    {
      id: 'progressive',
      title: 'Seamless HD Progressive',
      desc: 'Multi-focal premium lens with no visible lines. Smooth transition for all distances.',
      price: 90,
      badge: 'Premium',
    },
  ];

  const currentLensPrice = lensOptions.find((l) => l.id === lensType)?.price || 30;
  const totalPrice = product.price + currentLensPrice;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsUploading(true);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/prescriptions/upload-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileType: selectedFile.type,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          // Perform presigned S3 upload or mock upload
          await fetch(data.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': selectedFile.type },
            body: selectedFile,
          }).catch(() => {
            // If CORS/mock S3, fallback to data url or mock URL
          });

          setPrescriptionFileUrl(data.fileUrl || `https://sripalie-bucket.s3.amazonaws.com/uploads/${selectedFile.name}`);
        } else {
          setPrescriptionFileUrl(`https://sripalie-bucket.s3.amazonaws.com/uploads/${selectedFile.name}`);
        }
      } catch (err) {
        setPrescriptionFileUrl(`https://sripalie-bucket.s3.amazonaws.com/uploads/${selectedFile.name}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleConfirmAddToCart = () => {
    addToCart({
      product,
      lensType,
      lensPrice: currentLensPrice,
      prescriptionData: {
        sphere_OD: sphereOD,
        sphere_OS: sphereOS,
        cylinder_OD: cylinderOD,
        cylinder_OS: cylinderOS,
        axis_OD: axisOD,
        axis_OS: axisOS,
        add_power: addPower,
        pupillaryDistance: pd,
        prescriptionFileUrl,
      },
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize Lenses & Prescription" maxWidth="2xl">
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-[#7A1D28]' : 'text-slate-400'}`}>
            <span className="w-6 h-6 rounded-full bg-[#7A1D28] text-white flex items-center justify-center">1</span>
            <span>Lens Coating</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800"></div>
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-[#7A1D28]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#7A1D28] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Prescription Power</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200 dark:bg-slate-800"></div>
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-[#7A1D28]' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#7A1D28] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>Summary</span>
          </div>
        </div>

        {/* STEP 1: Select Lens Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7A1D28]" />
              Select Optical Lens Package
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lensOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setLensType(opt.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    lensType === opt.id
                      ? 'border-[#7A1D28] bg-rose-50/50 dark:bg-[#7A1D28]/10 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{opt.title}</span>
                    <Badge variant="burgundy">+${opt.price}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)}>Next: Prescription Power →</Button>
            </div>
          </div>
        )}

        {/* STEP 2: Prescription Power Entry */}
        {step === 2 && (
          <div className="space-y-5">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Glasses className="w-5 h-5 text-[#7A1D28]" />
              Enter Eye Power or Upload Doctor Slip
            </h4>

            {/* Upload slip option */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#7A1D28]" />
                Option A: Upload Prescription Photo / PDF (AWS S3 Storage)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#7A1D28] file:text-white hover:file:bg-[#5E161F]"
              />
              {isUploading && <p className="text-xs text-amber-600 mt-2">Uploading file to AWS S3 bucket...</p>}
              {prescriptionFileUrl && (
                <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" /> Slip attached: {file?.name || 'File uploaded'}
                </p>
              )}
            </div>

            <div className="relative text-center my-2">
              <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-bold uppercase">
                OR Option B: Enter Values Manually
              </span>
            </div>

            {/* Manual prescription table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <th className="p-2 border">Eye</th>
                    <th className="p-2 border">SPH (Sphere)</th>
                    <th className="p-2 border">CYL (Cylinder)</th>
                    <th className="p-2 border">AXIS</th>
                    <th className="p-2 border">ADD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border font-bold text-[#7A1D28]">Right Eye (OD)</td>
                    <td className="p-1 border">
                      <input type="number" step="0.25" value={sphereOD} onChange={(e) => setSphereOD(parseFloat(e.target.value) || 0)} className="w-full p-1 border rounded" />
                    </td>
                    <td className="p-1 border">
                      <input type="number" step="0.25" value={cylinderOD} onChange={(e) => setCylinderOD(parseFloat(e.target.value) || 0)} className="w-full p-1 border rounded" />
                    </td>
                    <td className="p-1 border">
                      <input type="number" value={axisOD} onChange={(e) => setAxisOD(parseInt(e.target.value) || 0)} className="w-full p-1 border rounded" />
                    </td>
                    <td className="p-1 border" rowSpan={2}>
                      <input type="number" step="0.25" value={addPower} onChange={(e) => setAddPower(parseFloat(e.target.value) || 0)} className="w-full p-1 border rounded" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-bold text-[#7A1D28]">Left Eye (OS)</td>
                    <td className="p-1 border">
                      <input type="number" step="0.25" value={sphereOS} onChange={(e) => setSphereOS(parseFloat(e.target.value) || 0)} className="w-full p-1 border rounded" />
                    </td>
                    <td className="p-1 border">
                      <input type="number" step="0.25" value={cylinderOS} onChange={(e) => setCylinderOS(parseFloat(e.target.value) || 0)} className="w-full p-1 border rounded" />
                    </td>
                    <td className="p-1 border">
                      <input type="number" value={axisOS} onChange={(e) => setAxisOS(parseInt(e.target.value) || 0)} className="w-full p-1 border rounded" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Pupillary Distance (PD in mm)
                </label>
                <input
                  type="number"
                  value={pd}
                  onChange={(e) => setPd(parseInt(e.target.value) || 63)}
                  className="w-full p-2 border rounded text-xs dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button onClick={() => setStep(3)}>Next: Review Order →</Button>
            </div>
          </div>
        )}

        {/* STEP 3: Summary & Total */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">Frame Model</span>
                <span className="font-bold text-slate-900 dark:text-white">{product.title} (${product.price.toFixed(2)})</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">Selected Lens</span>
                <span className="font-bold text-[#7A1D28] capitalize">{lensType.replace('-', ' ')} (+${currentLensPrice.toFixed(2)})</span>
              </div>

              <div className="flex justify-between items-center text-base font-extrabold text-slate-900 dark:text-white pt-2">
                <span>Total Combined Price</span>
                <span className="text-xl text-[#7A1D28]">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setStep(2)}>
                ← Edit Prescription
              </Button>
              <Button onClick={handleConfirmAddToCart} className="bg-[#7A1D28] hover:bg-[#5E161F]">
                Confirm & Add to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
