'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface RevenueChartProps {
  data: Array<{
    label: string;
    grossSales: number;
    advancePaid: number;
    balanceDue: number;
  }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7A1D28" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#7A1D28" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAdvance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} />
          <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={(val) => `$${val}`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, '']}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#CBD5E1' }} />
          <Area
            type="monotone"
            dataKey="grossSales"
            name="Gross Sales"
            stroke="#7A1D28"
            fillOpacity={1}
            fill="url(#colorGross)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="advancePaid"
            name="Advance Collected"
            stroke="#10B981"
            fillOpacity={1}
            fill="url(#colorAdvance)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="balanceDue"
            name="Outstanding Balance Due"
            stroke="#F43F5E"
            fillOpacity={1}
            fill="url(#colorBalance)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
