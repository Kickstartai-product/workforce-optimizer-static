import React from 'react';
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

interface ShortageBarChartProps {
  data: TransformedResult;
}

interface ShortageData {
  jobName: string;
  shortage: number;
}

interface CustomizedAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

const formatJobName = (job: string) => {
  return job.replace(/\\\-/g, "-"); // Only remove backslash from escaped hyphens
};

// Function to format numbers with dots for thousands (Dutch format)
const formatNumber = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = ({ x, y, payload }) => {
  const lines = formatJobName(payload.value).split('\n');
  
  return (
    <g transform={`translate(${x},${y}) rotate(-45)`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={10}
          dy={index * 12}
          textAnchor="end"
          fill="#666"
          fontSize={11}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-lg rounded">
        <p className="text-sm">{formatJobName(label)}</p>
        <p className="text-sm font-semibold">
          Tekort: {formatNumber(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const MobileShortageBarChart: React.FC<ShortageBarChartProps> = ({ data }) => {
  const sortedShortages: ShortageData[] = [...data.remainingShortages]
    .sort((a, b) => b.shortage - a.shortage)
    .slice(0, 10)
    .map(item => ({
      ...item,
      jobName: formatJobName(item.jobName)
    }));

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto pb-6">
        <div className="w-[200%] h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedShortages}
              margin={{
                top: 20,
                right: 0,
                left: 0,
                bottom: 120
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="jobName"
                interval={0}
                height={120}
                tick={<CustomizedAxisTick x={0} y={0} payload={{ value: '' }} />}
              />
              <YAxis
                label={{
                  value: 'Tekort',
                  angle: -90,
                  position: 'insideLeft',
                  dy: 50,
                  fontSize: 12
                }}
                tick={{ fontSize: 11 }}
                tickFormatter={formatNumber}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'transparent' }}
              />
              <Bar
                dataKey="shortage"
                fill="rgb(0,153,168)"
                name="Openstaande vacatures (Q1 2035)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MobileShortageBarChart;