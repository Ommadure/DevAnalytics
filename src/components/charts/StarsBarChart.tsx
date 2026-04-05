import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface StarsBarChartProps {
  data: { name: string; stars: number }[];
}

export function StarsBarChart({ data }: StarsBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
        No repository data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 h-full"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Most Starred Repositories</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(value) => (value.length > 10 ? `${value.substring(0, 10)}...` : value)}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
              }}
              itemStyle={{ color: '#1e293b' }}
            />
            <Bar dataKey="stars" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#3b82f6" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
