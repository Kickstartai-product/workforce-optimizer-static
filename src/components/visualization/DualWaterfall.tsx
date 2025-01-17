import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkforceMetrics } from '@/types/results';

interface DualWaterfallProps {
  data: { [key: string]: WorkforceMetrics };
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
  
  const jobs = Object.keys(data).sort((a, b) => {
    if (a === "Totaal") return -1;
    if (b === "Totaal") return 1;
    return a.localeCompare(b);
  });
  
  const [selectedJob, setSelectedJob] = useState<string>(jobs[0]);
  const selectedData = data[selectedJob];

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

  // Data generation functions remain the same
  const getSupplyData = () => {
    return [
      {
        name: "Arbeidsaanbod (2024)",
        value: Math.round(selectedData.labor_supply),
        displayValue: Math.round(selectedData.labor_supply)
      },
      {
        name: "Instroom minus uitstroom (tot 2035)",
        value: Math.round(selectedData.net_labor_change),
        displayValue: Math.round(selectedData.net_labor_change)
      },
      {
        name: "Transitie naar baan toe (tot 2035)",
        value: Math.round(selectedData.transitions_in),
        displayValue: Math.round(selectedData.transitions_in)
      },
      {
        name: "Transitie uit baan (tot 2035)",
        value: Math.round(selectedData.transitions_out),
        displayValue: Math.round(selectedData.transitions_out)
      }
    ];
  };

  const getDemandData = () => {
    return [
      {
        name: "Ingevulde arbeidsvraag (2024)",
        value: Math.round(selectedData.labor_supply),
        displayValue: Math.round(selectedData.labor_supply)
      },
      {
        name: "Vacatures boven 2% frictie",
        value: Math.round(selectedData.vacancies),
        displayValue: Math.round(selectedData.vacancies)
      },
      {
        name: "Uitbreidsvraag",
        value: Math.round(selectedData.expansion_demand),
        displayValue: Math.round(selectedData.expansion_demand)
      },
      {
        name: "Afname groei door productiviteit",
        value: Math.round(selectedData.productivity),
        displayValue: Math.round(selectedData.productivity)
      }
    ].reverse();
  };

  const getGapData = () => {
    const total_supply = selectedData.labor_supply + 
                        selectedData.net_labor_change + 
                        selectedData.transitions_in + 
                        selectedData.transitions_out;
  
    const total_demand = selectedData.labor_supply +
                        selectedData.vacancies +
                        selectedData.expansion_demand +
                        selectedData.productivity;
  
    const baseValue = Math.min(total_supply, total_demand);
    
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
        value: Math.round(selectedData.superfluous_workers) * -1,
        displayValue: Math.round(selectedData.superfluous_workers) * -1,
        isExcessWorkers: true,
        base: Math.round(total_supply)
      },
      {
        name: "Tekort (2035)",
        value: Math.round(selectedData.shortage),
        displayValue: Math.round(selectedData.shortage),
        isShortage: true,
        base: baseValue
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
        <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 text-xs">
          <p className="font-medium text-gray-900">{label}</p>
          <p>
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
  }: ChartComponentProps) => {
    const chartHeight = isMobile ? 200 : 500;
    const fontSize = isMobile ? 6 : 12;
    const barSize = isMobile ? 10 : 40;
    const marginTop = isMobile ? 10 : 40;
    const marginBottom = isMobile ? 30 : 60;
    const marginSide = isMobile ? 5 : 30;
    const axisMargin = isMobile ? 20 : 60;
    
    return (
      <div className="w-full h-full flex flex-col">
        <div className="text-center mb-1">
          <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-xs' : 'text-lg'}`}>{title}</h3>
          <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>{subtitle}</p>
        </div>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={data}
              margin={{
                top: marginTop,
                right: showAxis ? marginSide : isGapChart ? axisMargin : marginSide,
                left: showAxis ? axisMargin : isGapChart ? axisMargin : marginSide,
                bottom: marginBottom
              }}
              barSize={barSize}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                dy={2}
                angle={-45}
                textAnchor="end"
                height={marginBottom}
                tick={{ fill: '#6b7280', fontSize }}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                dx={-2}
                tick={{ fill: '#6b7280', fontSize }}
                tickFormatter={formatNumber}
                orientation={orientation}
                hide={isGapChart}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="base" stackId="a" fill="transparent" />
              <Bar 
                dataKey="value" 
                stackId="a"
                radius={[2, 2, 0, 0]}
              >
                <LabelList
                  dataKey="displayValue"
                  position="top"
                  formatter={formatNumber}
                  fill={((props: any) => props.value >= 0 ? "#10b981" : "#ef4444") as unknown as string}
                  style={{ fontSize }}
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
  };

  const JobSelector = () => (
    <div className="w-full max-w-xs mb-4">
      <Select value={selectedJob} onValueChange={setSelectedJob}>
        <SelectTrigger>
          <SelectValue placeholder="Select a job" />
        </SelectTrigger>
        <SelectContent>
          {jobs.map((job) => (
            <SelectItem key={job} value={job}>
              {job}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className={className}>
      <JobSelector />
      <div className="flex divide-x divide-gray-200">
        <div className="flex-1 pr-1">
          <ChartComponent 
            data={processLeftData(getSupplyData())} 
            title="Supply Side" 
            subtitle="Workforce changes and adjustments"
          />
        </div>
        <div className="flex-1 px-1">
          <ChartComponent 
            data={getGapData()} 
            title="Gap" 
            subtitle="Supply-Demand Imbalance"
            showAxis={false}
            isGapChart={true}
          />
        </div>
        <div className="flex-1 pl-1">
          <ChartComponent 
            data={processRightData(getDemandData())} 
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