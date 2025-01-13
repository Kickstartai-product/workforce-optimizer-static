// ShortageBarChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { TransformedResult } from '@/types/results';
import { useScreenSize } from '@/hooks/useScreenSize';

interface ShortageBarChartProps {
  data: TransformedResult;
}

export const ShortageBarChart = ({ data }: ShortageBarChartProps) => {
  const { isMobile } = useScreenSize();
  
  const sortedShortages = [...data.remainingShortages]
    .sort((a, b) => b.shortage - a.shortage)
    .slice(0, 10);

  if (isMobile) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedShortages}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            dataKey="jobName"
            type="category"
            tick={false}
            width={1}
          />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            labelStyle={{ fontSize: 12 }}
            cursor={{ fill: 'transparent' }}
          />
          <Bar
            dataKey="shortage"
            fill="#3b82f6"
            name="Shortage"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedShortages}
        margin={{
          top: 20,
          right: 40,
          left: 60,
          bottom: 90
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="jobName"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
          dy={8}
          tick={{ fontSize: 11, fill: '#666' }}
        />
        <YAxis
          label={{
            value: 'Shortage',
            angle: -90,
            position: 'insideLeft',
            dy: 50,
            fontSize: 12
          }}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          labelStyle={{ fontSize: 12 }}
          cursor={{ fill: 'transparent' }}
        />
        <Bar
          dataKey="shortage"
          fill="#3b82f6"
          name="Shortage"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};