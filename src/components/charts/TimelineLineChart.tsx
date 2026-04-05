import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface TimelineLineChartProps {
  data: { year: string; count: number }[];
}

export function TimelineLineChart({ data }: TimelineLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
        No timeline data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 h-full"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Repositories Created Per Year</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
              }}
              itemStyle={{ color: '#1e293b' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
