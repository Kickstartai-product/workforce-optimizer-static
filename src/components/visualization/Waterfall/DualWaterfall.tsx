import { useState, useMemo } from 'react';
import { ChartComponent } from './WaterfallChart';
import { JobSelector } from './JobSelector';
import { FootnoteDisplay } from './FootnoteDisplay';
import {
  getSupplyData,
  getDemandData,
  getGapData,
  processLeftData,
  processRightData,
  determineIncrement,
  roundUpToNice
} from './utils';
import type { DualWaterfallProps, FootnoteEntry, ChartData } from './types';

const AXIS_WIDTH = 200; // Width needed for axis

export const DualWaterfall = ({ data, className = "" }: DualWaterfallProps) => {
  const jobs = Object.keys(data).sort((a, b) => {
    if (a === "Totaal") return -1;
    if (b === "Totaal") return 1;
    return a.localeCompare(b);
  });

  const [selectedJob, setSelectedJob] = useState<string>(jobs[0]);
  const selectedData = data[selectedJob];

  // Extract footnotes from all chart data
  const footnotes = useMemo(() => {
    const collectFootnotes = (chartData: ChartData[]): FootnoteEntry[] => {
      return chartData
        .filter(item => item.footnote)
        .map(item => ({
          number: item.footnoteNumber || 0,
          text: item.footnote!
        }));
    };

    const supplyFootnotes = collectFootnotes(getSupplyData(selectedData));
    const demandFootnotes = collectFootnotes(getDemandData(selectedData));
    const gapFootnotes = collectFootnotes(getGapData(selectedData));

    return [...supplyFootnotes, ...demandFootnotes, ...gapFootnotes];
  }, [selectedData]);

  const calculateDomain = () => {
    const supplyData = processLeftData(getSupplyData(selectedData));
    const demandData = processRightData(getDemandData(selectedData));
    const gapData = getGapData(selectedData);
  
    const allValues = [
      ...supplyData,
      ...demandData,
      ...gapData
    ].map(item => (item.base || 0) + item.value);
  
    const maxValue = Math.max(...allValues);
    const increment = determineIncrement(maxValue);
    const roundedMax = roundUpToNice(maxValue, increment);
  
    // Set minimum based on job type
    const domainMin = selectedJob === "Totaal" ? 6000000 : 0;
    const domainMax = selectedJob === "Totaal" ? 11000000 : roundedMax;

  
    return [domainMin, domainMax] as [number, number];
  };

  const domain = calculateDomain();

  // Calculate widths based on number of bars
  const supplyData = getSupplyData(selectedData);
  const demandData = getDemandData(selectedData);
  const gapData = getGapData(selectedData);
  
  // Calculate the content width (total width minus axes and spacing)
  const supplyBarSpace = supplyData.length;
  const gapBarSpace = gapData.length;
  const demandBarSpace = demandData.length;
  const totalBarSpace = supplyBarSpace + gapBarSpace + demandBarSpace;

  // Calculate proportional widths including space for axes where needed
  const supplyWidth = `calc(${(supplyBarSpace / totalBarSpace) * 100}% + ${AXIS_WIDTH}px)`;
  const gapWidth = `calc(${(gapBarSpace / totalBarSpace) * 100}%)`;
  const demandWidth = `calc(${(demandBarSpace / totalBarSpace) * 100}% + ${AXIS_WIDTH}px)`;

  return (
    <div className={className}>
      <JobSelector
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        jobs={jobs}
      />
      <div className="flex flex-col">
        <div className="flex divide-x divide-gray-200">
          <div style={{ width: supplyWidth }} className="pr-2">
            <ChartComponent
              data={processLeftData(getSupplyData(selectedData))}
              title="Arbeidsaanbod"
              subtitle="Ontwikkeling tussen Q1 2024 en Q1 2035"
              domain={domain}
            />
          </div>
          <div style={{ width: gapWidth }} className="px-2">
            <ChartComponent
              data={getGapData(selectedData)}
              title="Match tussen arbeidsvraag en -aanbod"
              subtitle="Uitkomst Q1 2035"
              showAxis={false}
              isGapChart={true}
              domain={domain}
            />
          </div>
          <div style={{ width: demandWidth }} className="pl-2">
            <ChartComponent
              data={processRightData(getDemandData(selectedData))}
              title="Arbeidsvraag"
              subtitle="Ontwikkeling tussen Q1 2024 en Q1 2035"
              orientation="right"
              domain={domain}
            />
          </div>
        </div>
        {footnotes.length > 0 && (
          <div className="mt-8 px-4">
            <FootnoteDisplay footnotes={footnotes}/>
          </div>
        )}
      </div>
    </div>
  );
};