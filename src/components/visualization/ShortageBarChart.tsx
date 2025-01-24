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

const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = ({ x, y, payload }) => {
  const lines = payload.value.split('\n');

  return (
    <g transform={`translate(${x},${y}) rotate(-45)`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={10}  // Changed from index * 12
          dy={index * 12}  // Move the line spacing to dy instead
          textAnchor="end"  // Changed from "middle" to "end"
          fill="#666"
          fontSize={11}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export const ShortageBarChart: React.FC<ShortageBarChartProps> = ({ data }) => {
  
  const sortedShortages: ShortageData[] = [...data.remainingShortages]
    .sort((a, b) => b.shortage - a.shortage)
    .slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={sortedShortages}
        margin={{
          top: 20,
          right: 40,
          left: 60,
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
        />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          labelStyle={{ fontSize: 12 }}
          cursor={{ fill: 'transparent' }}
        />
        <Bar
          dataKey="shortage"
          fill="rgb(0,153,168)"
          name="Openstaande vacatures (Q1 2035)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ShortageBarChart;