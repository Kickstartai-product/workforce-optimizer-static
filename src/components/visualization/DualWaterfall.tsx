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
  ReferenceLine,
} from 'recharts';
import { useScreenSize } from '@/hooks/useScreenSize';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkforceMetrics } from '@/types/results';

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
  domain: [number, number];
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
    if (value === 0) return "0";
    if (Math.abs(value) === 0) return value < 0 ? "-0" : "0";

    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${value < 0 ? '-' : ''}${(absValue / 1000).toFixed(0)}K`;
    }
    return `${value < 0 ? '-' : ''}${absValue.toLocaleString()}`;
  };

  const getSupplyData = () => {
    return [
      {
        name: "Arbeidsaanbod (2024)",
        value: Math.round(selectedData.labor_supply),
        displayValue: Math.round(selectedData.labor_supply),
        xValue: 1
      },
      {
        name: "Instroom minus uitstroom (tot 2035)",
        value: Math.round(selectedData.net_labor_change),
        displayValue: Math.round(selectedData.net_labor_change),
        xValue: 2
      },
      {
        name: "Transitie naar baan toe (tot 2035)",
        value: Math.round(selectedData.transitions_in),
        displayValue: Math.round(selectedData.transitions_in),
        xValue: 3
      },
      {
        name: "Transitie uit baan (tot 2035)",
        value: Math.round(selectedData.transitions_out),
        displayValue: Math.round(selectedData.transitions_out),
        xValue: 4
      }
    ];
  };

  const getDemandData = () => {
    return [
      {
        name: "Ingevulde arbeidsvraag (2024)",
        value: Math.round(selectedData.labor_supply),
        displayValue: Math.round(selectedData.labor_supply),
        xValue: 4
      },
      {
        name: "Vacatures boven 2% frictie",
        value: Math.round(selectedData.vacancies),
        displayValue: Math.round(selectedData.vacancies),
        xValue: 3
      },
      {
        name: "Uitbreidsvraag",
        value: Math.round(selectedData.expansion_demand),
        displayValue: Math.round(selectedData.expansion_demand),
        xValue: 2
      },
      {
        name: "Afname groei door productiviteit",
        value: Math.round(selectedData.productivity),
        displayValue: Math.round(selectedData.productivity),
        xValue: 1
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
        base: 0,
        xValue: 1
      },
      {
        name: "Overtollig (2035)",
        value: Math.round(selectedData.superfluous_workers) * -1,
        displayValue: Math.round(selectedData.superfluous_workers) * -1,
        isExcessWorkers: true,
        base: Math.round(total_supply),
        xValue: 2
      },
      {
        name: "Tekort (2035)",
        value: Math.round(selectedData.shortage),
        displayValue: Math.round(selectedData.shortage),
        isShortage: true,
        base: baseValue - selectedData.superfluous_workers,
        xValue: 3
      },
      {
        name: "Arbeidsvraag (2035)",
        value: Math.round(total_demand),
        displayValue: Math.round(total_demand),
        isFinalProjection: true,
        base: 0,
        xValue: 4
      }
    ];
  };

  const processLeftData = (data: any[]) => {
    let total = 0;
    return data.map((item, index) => {
      const base = total;
      total += item.value;
      return {
        ...item,
        base,
        total,
        uniqueId: `left-${index}`
      };
    });
  };

  const processRightData = (data: any[]) => {
    let total = data.reduce((sum, item) => sum + item.value, 0);
    return data.map((item, index) => {
      total -= item.value;
      return {
        ...item,
        base: total,
        total: total + item.value,
        uniqueId: `right-${index}`
      };
    });
  };

  const determineIncrement = (maxValue: number): number => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));

    if (maxValue < 100) {
      return maxValue <= 50 ? 5 : 10;
    }

    const possibleIncrements = [
      magnitude / 5,
      magnitude / 2,
      magnitude,
      magnitude * 2,
      magnitude * 5
    ];

    return possibleIncrements.find(inc => maxValue / inc <= 8) || magnitude;
  };

  const roundUpToNice = (value: number, increment: number): number => {
    const rawRounded = Math.ceil(value / increment) * increment;
    const maxAllowed = value * 1.2;
    return Math.min(rawRounded, maxAllowed);
  };

  const calculateDomain = () => {
    const supplyData = processLeftData(getSupplyData());
    const demandData = processRightData(getDemandData());
    const gapData = getGapData();

    const allValues = [
      ...supplyData,
      ...demandData,
      ...gapData
    ].map(item => (item.base || 0) + item.value);

    const maxValue = Math.max(...allValues);
    const increment = determineIncrement(maxValue);
    const roundedMax = roundUpToNice(maxValue, increment);

    return [0, roundedMax] as [number, number];
  };

  const domain = calculateDomain();

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
    isGapChart = false,
    domain
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
                dataKey="xValue"
                type="number"
                domain={[0.5, 4.5]}
                hide
                axisLine={false}
                tickLine={false}
              />
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
                xAxisId="category"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                dx={-2}
                tick={{ fill: '#6b7280', fontSize }}
                tickFormatter={formatNumber}
                ticks={Array.from(
                  { length: (domain[1] / determineIncrement(domain[1])) + 1 },
                  (_, i) => i * determineIncrement(domain[1])
                )}
                orientation={orientation}
                hide={isGapChart}
                domain={domain}
                interval={0}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Connecting dashed lines */}
              {data.map((entry, index) => {
                if (index < data.length - 1) {
                  const barHalfWidth = 0.4;
                  const isRightOriented = orientation === "right";

                  if (isRightOriented) {
                    const currentTotal = entry.base
                    const nextEntry = data[index + 1]; // Back to looking forward
                    return (
                      <ReferenceLine
                        key={`connector-${entry.uniqueId}`}
                        segment={[
                          { x: entry.xValue + barHalfWidth, y: currentTotal }, // Left edge of current (higher xValue)
                          { x: nextEntry.xValue - barHalfWidth, y: currentTotal } // Right edge of next (lower xValue)
                        ]}
                        stroke="#000000"
                        strokeDasharray="3 3"
                      />
                    );
                  } else {
                    const currentTotal = entry.base + entry.value;
                    // Left side chart remains the same
                    return (
                      <ReferenceLine
                        key={`connector-${entry.uniqueId}`}
                        segment={[
                          { x: entry.xValue + barHalfWidth, y: currentTotal },
                          { x: data[index + 1].xValue - barHalfWidth, y: currentTotal }
                        ]}
                        stroke="#000000"
                        strokeDasharray="3 3"
                      />
                    );
                  }
                }
                return null;
              })}

              <Bar
                dataKey="base"
                stackId={`stack-${title}`}
                fill="transparent"
                key={`${title}-base`}
                id={`${title}-base-bar`}
                name={`${title}-base`}
              />
              <Bar
                dataKey="value"
                stackId={`stack-${title}`}
                radius={[2, 2, 0, 0]}
                key={`${title}-value`}
                id={`${title}-value-bar`}
                name={`${title}-value`}
              >
                <LabelList
                  dataKey="displayValue"
                  position="top"
                  formatter={formatNumber}
                  fill={((props: any) => props.value >= 0 ? "#10b981" : "#ef4444") as unknown as string}
                  style={{ fontSize }}
                  key={`${title}-labels`}
                />
                {data.map((entry, index) => {
                  if (entry.isFinalProjection) {
                    return <Cell key={`${entry.uniqueId}-final`} fill="#9333ea" opacity={0.7} />;
                  }
                  if (entry.isExcessWorkers) {
                    return <Cell key={`${entry.uniqueId}-excess`} fill="#7c3aed" opacity={0.5} />;
                  }
                  if (entry.isShortage) {
                    return <Cell key={`${entry.uniqueId}-shortage`} fill="#7c3aed" />;
                  }
                  return <Cell
                    key={entry.uniqueId}
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
            domain={domain}
          />
        </div>
        <div className="flex-1 px-1">
          <ChartComponent
            data={getGapData()}
            title="Gap"
            subtitle="Supply-Demand Imbalance"
            showAxis={false}
            isGapChart={true}
            domain={domain}
          />
        </div>
        <div className="flex-1 pl-1">
          <ChartComponent
            data={processRightData(getDemandData())}
            title="Demand Side"
            subtitle="Demand components and changes"
            orientation="right"
            domain={domain}
          />
        </div>
      </div>
    </div>
  );
};

export default DualWaterfall;