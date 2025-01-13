import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Setting } from '@/types/settings';

interface SettingsBarChartProps {
  settings: Setting[];
}

export const SettingsBarChart = ({ settings }: SettingsBarChartProps) => {
  const data = settings.map(setting => ({
    name: setting.label,
    value: setting.value
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};