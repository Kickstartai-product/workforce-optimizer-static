import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { useScreenSize } from '@/hooks/useScreenSize';

interface DualWaterfallProps {
  data: {
    labor_supply: number;
    net_labor_change: number;
    total_transitions: number;
    superfluous_workers: number;
    total_shortage: number;
    productivity: number;
    expansion_demand: number;
    vacancies: number;
  };
  className?: string;
}

interface ChartComponentProps {
  data: any[];
  title: string;
  subtitle: string;
  showAxis?: boolean;
  orientation?: "left" | "right";
  isGapChart?: boolean;
}

export const DualWaterfall = ({ data, className = "" }: DualWaterfallProps) => {
  const { isMobile } = useScreenSize();

  const formatNumber = (value: number): string => {
    if (value === 0) return "±0";
    if (Math.abs(value) === 0) return value < 0 ? "-0" : "+0";

    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${value < 0 ? '' : '+'}${(value / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${value < 0 ? '' : '+'}${(value / 1000).toFixed(0)}K`;
    }
    return `${value < 0 ? '' : '+'}${value.toLocaleString()}`;
  };

  const getSupplyData = () => {

    return [
      {
        name: "Arbeidsaanbod (2024)",
        value: Math.round(data.labor_supply),
        displayValue: Math.round(data.labor_supply)
      },
      {
        name: "Instroom minus uitstroom (tot 2035)",
        value: Math.round(data.net_labor_change),
        displayValue: Math.round(data.net_labor_change)
      },
      {
        name: "Transitie naar baan toe (tot 2035)",
        value: Math.round(data.total_transitions),
        displayValue: Math.round(data.total_transitions)
      },
      {
        name: "Transitie uit baan (tot 2035)",
        value: Math.round(data.total_transitions * -1),
        displayValue: Math.round(data.total_transitions * -1)
      }
    ];
  };

  const getDemandData = () => {

    return [
      {
        name: "Ingevulde arbeidsvraag (2024)",
        value: Math.round(data.labor_supply),
        displayValue: Math.round(data.labor_supply)
      },
      {
        name: "Vacatures boven 2% frictie",
        value: Math.round(data.vacancies),
        displayValue: Math.round(data.vacancies)
      },
      {
        name: "Uitbreidsvraag",
        value: Math.round(data.expansion_demand),
        displayValue: Math.round(data.expansion_demand)
      },
      {
        name: "Afname groei door productiviteit",
        value: Math.round(data.productivity),
        displayValue: Math.round(data.productivity)
      }
    ].reverse();
  };

  const getGapData = () => {
    const total_supply = data.labor_supply + 
                        data.net_labor_change + 
                        data.total_transitions + 
                        (data.total_transitions * -1);

    const total_demand = data.labor_supply +
                        data.vacancies +
                        data.expansion_demand +
                        data.productivity;

    const shortageBase = Math.min(
      total_supply - data.superfluous_workers, 
      total_demand
    );

    return [
      {
        name: "Arbeidsaanbod (2035)",
        value: Math.round(total_supply),
        displayValue: Math.round(total_supply),
        isFinalProjection: true,
        base: 0
      },
      {
        name: "Overtollig (2035)",
        value: Math.round(data.superfluous_workers) * -1,
        displayValue: Math.round(data.superfluous_workers) * -1,
        isExcessWorkers: true,
        base: Math.round(total_supply)
      },
      {
        name: "Tekort (2035)",
        value: Math.round(data.total_shortage),
        displayValue: Math.round(data.total_shortage),
        isShortage: true,
        base: shortageBase
      },
      {
        name: "Arbeidsvraag (2035)",
        value: Math.round(total_demand),
        displayValue: Math.round(total_demand),
        isFinalProjection: true,
        base: 0
      }
    ];
  };

  const processLeftData = (data: any[]) => {
    let total = 0;
    return data.map(item => {
      const base = total;
      total += item.value;
      return {
        ...item,
        base
      };
    });
  };

  const processRightData = (data: any[]) => {
    let total = data.reduce((sum, item) => sum + item.value, 0);
    return data.map(item => {
      total -= item.value;
      return {
        ...item,
        base: total
      };
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].payload.displayValue;
      const isZero = value === 0 || Math.abs(value) === 0;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm">
            <span className={
              isZero ? "text-gray-500" : 
              value > 0 ? "text-emerald-600" : "text-red-600"
            }>
              {formatNumber(value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const ChartComponent = ({ 
    data, 
    title, 
    subtitle, 
    showAxis = true, 
    orientation = "left",
    isGapChart = false 
  }: ChartComponentProps) => (
    <div className="w-full h-full flex flex-col">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={data}
            margin={{
              top: 40,
              right: showAxis ? 30 : isGapChart ? 60 : 30,
              left: showAxis ? 60 : isGapChart ? 60 : 30,
              bottom: 60
            }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              dy={8}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              dx={-8}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={formatNumber}
              orientation={orientation}
              hide={isGapChart}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="base" stackId="a" fill="transparent" />
            <Bar 
              dataKey="value" 
              stackId="a"
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="displayValue"
                position="top"
                formatter={formatNumber}
                fill={((props: any) => props.value >= 0 ? "#10b981" : "#ef4444") as unknown as string}
                />
              {data.map((entry, index) => {
                if (entry.isFinalProjection) {
                  return <Cell key={index} fill="#9333ea" opacity={0.7} />;
                }
                if (entry.isExcessWorkers) {
                  return <Cell key={index} fill="#7c3aed" opacity={0.5} />;
                }
                if (entry.isShortage) {
                  return <Cell key={index} fill="#7c3aed" />;
                }
                return <Cell 
                  key={index} 
                  fill={entry.value >= 0 ? "#10b981" : "#ef4444"} 
                />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const supplyData = processLeftData(getSupplyData());
  const gapData = getGapData();
  const demandData = processRightData(getDemandData());

  if (isMobile) {
    return (
      <div className={className}>
        <ChartComponent 
          data={supplyData} 
          title="Supply Side" 
          subtitle="Workforce changes and adjustments"
        />
        <ChartComponent 
          data={gapData} 
          title="Gap" 
          subtitle="Supply-Demand Imbalance"
          showAxis={false}
          isGapChart={true}
        />
        <ChartComponent 
          data={demandData} 
          title="Demand Side" 
          subtitle="Demand components and changes"
          orientation="right"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex divide-x divide-gray-200">
        <div className="flex-1 pr-2">
          <ChartComponent 
            data={supplyData} 
            title="Supply Side" 
            subtitle="Workforce changes and adjustments"
          />
        </div>
        <div className="flex-1 px-2">
          <ChartComponent 
            data={gapData} 
            title="Gap" 
            subtitle="Supply-Demand Imbalance"
            showAxis={false}
            isGapChart={true}
          />
        </div>
        <div className="flex-1 pl-2">
          <ChartComponent 
            data={demandData} 
            title="Demand Side" 
            subtitle="Demand components and changes"
            orientation="right"
          />
        </div>
      </div>
    </div>
  );
};

export default DualWaterfall;