import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Input = React.forwardRef(({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1", children: label })), _jsx("input", { id: inputId, ref: ref, className: `w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1D28] dark:bg-slate-800 dark:border-slate-700 dark:text-white ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'} ${className}`, ...props }), error ? (_jsx("p", { className: "mt-1 text-xs text-red-600 dark:text-red-400", children: error })) : helperText ? (_jsx("p", { className: "mt-1 text-xs text-slate-500 dark:text-slate-400", children: helperText })) : null] }));
});
Input.displayName = 'Input';
