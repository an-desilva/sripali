import React from 'react';
export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'burgundy' | 'slate';
    className?: string;
}
export declare const Badge: React.FC<BadgeProps>;
