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
  import { determineIncrement, formatNumber } from './utils';
  import { CustomTooltip } from './ChartTooltip';
  import type { ChartComponentProps } from './types';
  
  // Mobile-optimized custom tick component
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    
    const parts = payload.value.split('|||');
    const label = parts[0];
    const footnoteNumber = parts[1];
  
    const lines = [label];
    const lineHeight = 10; // Reduced line height for mobile
  
    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, index) => (
          <text
            key={index}
            x={0}
            y={index * lineHeight}
            dy={14} // Slightly reduced dy
            textAnchor="end"
            fill="#6b7280"
            fontSize={9} // Slightly larger font for better readability
            transform="rotate(-45)"
          >
            {line}
            {index === lines.length - 1 && footnoteNumber && (
              <tspan baselineShift="super" fontSize={6}>{footnoteNumber}</tspan>
            )}
          </text>
        ))}
      </g>
    );
  };
  
  export const MobileChartComponent = ({
    data,
    title,
    subtitle,
    showAxis = true,
    orientation = "left",
    isGapChart = false,
    domain
  }: ChartComponentProps) => {
    const barCount = data.length;
    const domainMin = 0.5;
    const domainMax = barCount + 0.5;
  
    const dataWithFootnotes = data.map(item => ({
      ...item,
      name: item.footnote ? `${item.name}|||${item.footnoteNumber || 'X'}` : item.name
    }));
  
    const generateConnectingLines = () => {
      const lines: JSX.Element[] = [];
      const barHalfWidth = 0.3;
      const isRightOriented = orientation === "right";
  
      let lastNonZeroIndex = -1;
  
      for (let i = 0; i < data.length; i++) {
        if (data[i].value !== 0) {
          lastNonZeroIndex = i;
          break;
        }
      }
  
      if (lastNonZeroIndex !== -1) {
        for (let i = lastNonZeroIndex + 1; i < data.length; i++) {
          if (data[i].value !== 0 || i === data.length - 1) {
            const startEntry = data[lastNonZeroIndex];
            const endEntry = data[i];
  
            const startY = isRightOriented ? 
              (startEntry.base ?? 0) : 
              ((startEntry.base ?? 0) + startEntry.value);
  
            if (startEntry.value !== 0 || endEntry.value !== 0) {
              lines.push(
                <ReferenceLine
                  key={`connector-${title}-${startEntry.uniqueId}-${endEntry.uniqueId}-${i}-${startY}`}
                  segment={[
                    { x: startEntry.xValue + barHalfWidth, y: startY },
                    { x: endEntry.xValue - barHalfWidth, y: startY }
                  ]}
                  stroke="#000000"
                  strokeDasharray="3 3"
                  strokeWidth={0.5} // Thinner lines for mobile
                  className="line-transition"
                />
              );
            }
  
            lastNonZeroIndex = i;
          }
        }
      }
  
      return lines;
    };
  
    const linesKey = `lines-${title}-${orientation}-${data.map(d => `${d.uniqueId}-${d.value}`).join('-')}`;

    const calculateTicks = (domain: [number, number]) => {
      const [min, max] = domain;
      const increment = determineIncrement(max - min);
      const ticks: number[] = [];
      
      // Start from the domain minimum, rounded down to nearest increment
      let currentTick = Math.floor(min / increment) * increment;
      
      while (currentTick <= max) {
        ticks.push(currentTick);
        currentTick += increment;
      }
      
      // Add the final tick if it's not already included
      if (currentTick - increment < max) {
        ticks.push(currentTick);
      }
      
      return ticks;
    };
  
    const yAxisTicks = calculateTicks(domain);
  
    return (
      <div className="w-full h-full flex flex-col">
        <style>
          {`
            .line-transition {
              transition: opacity 300ms ease-in-out;
              opacity: 0;
            }
            .line-container-mounted .line-transition {
              opacity: 1;
            }
          `}
        </style>
        <div className="text-center mb-1">
          <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
          <p className="text-gray-600 text-xs">{subtitle}</p>
        </div>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={dataWithFootnotes}
              margin={{
                top: 30, // Reduced margins
                right: showAxis ? 10 : 5,
                left: showAxis ? 10 : 5,
                bottom: 80 // Increased bottom margin for label spacing
              }}
              barSize={30} // Smaller bars
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="xValue"
                type="number"
                domain={[domainMin, domainMax]}
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
                height={120} // Increased height for better label spacing
                tick={<CustomXAxisTick />}
                interval={0}
                xAxisId="category"
              />
            <YAxis
              axisLine={false}
              tickLine={false}
              dx={-2}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={formatNumber}
              ticks={yAxisTicks}
              orientation={'left'}
              hide={isGapChart}
              domain={domain}
              interval={0}
              type="number"
              allowDataOverflow={true}
            />
              <Tooltip content={<CustomTooltip />} />
  
              <g key={linesKey} className="line-container-mounted">
                {generateConnectingLines()}
              </g>
  
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
                animationDuration={300}
              >
                <LabelList
                  dataKey="displayValue"
                  position="top"
                  formatter={formatNumber}
                  fill={((props: any) => {
                    if (props.value >= 0) {
                      if (props.payload.isShortageReduction) return "rgb(0,168,153)";
                      return "#10b981";
                    }
                    return "#ef4444";
                  }) as unknown as string}
                  style={{ fontSize: 10 }} // Smaller font for labels
                  key={`${title}-labels`}
                />
                {data.map((entry, _) => {
                  if (entry.isFinalProjection) {
                    return <Cell key={`${entry.uniqueId}-final`} fill="rgb(0,153,168)" opacity={1} />;
                  }
                  if (entry.isExcessWorkers) {
                    return <Cell key={`${entry.uniqueId}-excess`} fill="rgb(0,153,168)" opacity={0.5} />;
                  }
                  if (entry.isShortageReduction) {
                    return <Cell key={`${entry.uniqueId}-reduction`} fill="rgb(0,153,168)" />;
                  }
                  if (entry.isShortage) {
                    return <Cell key={`${entry.uniqueId}-shortage`} fill="rgb(0,153,168)" opacity={0.5} />;
                  }
                  return <Cell
                    key={entry.uniqueId}
                    fill={entry.value >= 0 ? "rgb(75,169,115)" : "rgb(231,76,60)"}
                  />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
