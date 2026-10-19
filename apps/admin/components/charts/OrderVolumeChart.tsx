'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface OrderVolumeChartProps {
  data: Array<{
    label: string;
    ordersCount: number;
  }>;
}

export const OrderVolumeChart: React.FC<OrderVolumeChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} />
          <YAxis stroke="#94A3B8" fontSize={11} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#CBD5E1' }} />
          <Bar dataKey="ordersCount" name="Total Spectacle Orders" fill="#D13B51" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
