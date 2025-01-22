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
  isMobile?: boolean;
}

const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = ({ x, y, payload, isMobile }) => {
  const lines = payload.value.split('\n');

  if (isMobile) {
    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, index) => (
          <text
            key={index}
            x={-10}  // Add some padding from the axis
            y={index * 12}
            dy={4}   // Adjust vertical alignment
            textAnchor="end"
            fill="#666"
            fontSize={11}
          >
            {line}
          </text>
        ))}
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * 12}
          dy={16}
          textAnchor="middle"
          fill="#666"
          fontSize={11}        >
          {line}
        </text>
      ))}
    </g>
  );
};

export const ShortageBarChart: React.FC<ShortageBarChartProps> = ({ data }) => {
  const { isMobile } = useScreenSize();
  
  const sortedShortages: ShortageData[] = [...data.remainingShortages]
    .sort((a, b) => b.shortage - a.shortage)
    .slice(0, 10);

  if (isMobile) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedShortages}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 0,  // Increased left margin for labels
            bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number" 
            tick={{ fontSize: 11 }}
            domain={[0, 'dataMax']}
          />
          <YAxis
            dataKey="jobName"
            type="category"
            tick={<CustomizedAxisTick x={0} y={0} payload={{ value: '' }} isMobile={true} />}
            width={130}
          />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            labelStyle={{ fontSize: 12 }}
            cursor={{ fill: 'transparent' }}
          />
          <Bar
            dataKey="shortage"
            fill="#3b82f6"
            name="Tekort"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

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
          tick={<CustomizedAxisTick x={0} y={0} payload={{ value: '' }} isMobile={false} />}
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

ShortageBarChart;