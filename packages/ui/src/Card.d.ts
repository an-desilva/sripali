import React from 'react';
export interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}
export declare const Card: React.FC<CardProps>;
