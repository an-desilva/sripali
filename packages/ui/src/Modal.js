import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'lg', }) => {
    if (!isOpen)
        return null;
    const maxWidthStyles = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: _jsxs("div", { className: "flex min-h-screen items-center justify-center p-4 text-center sm:p-0", children: [_jsx("div", { className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsxs("div", { className: `relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left shadow-xl transition-all sm:my-8 w-full ${maxWidthStyles[maxWidth]}`, children: [title && (_jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4", children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white", children: title }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800", children: "\u2715" })] })), _jsx("div", { className: "px-6 py-5", children: children })] })] }) }));
};
