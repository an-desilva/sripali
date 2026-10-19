import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'burgundy' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => {
  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    burgundy: 'bg-[#7A1D28]/10 text-[#7A1D28] dark:bg-[#7A1D28]/30 dark:text-rose-200 border border-[#7A1D28]/20',
    slate: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
