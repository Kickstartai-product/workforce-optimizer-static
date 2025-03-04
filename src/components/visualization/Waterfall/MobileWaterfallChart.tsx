import { useState, useMemo } from 'react';
import { MobileChartComponent } from './MobileChartComponent';
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

export const MobileDualWaterfall = ({ data, className = "" }: DualWaterfallProps) => {
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

  return (
    <div className={className}>
      <JobSelector
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        jobs={jobs}
      />
      <div className="flex flex-col space-y-8">
        {/* Supply Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <MobileChartComponent
            data={processLeftData(getSupplyData(selectedData))}
              title="Arbeidsaanbod"
              subtitle="Ontwikkeling tussen Q1 2024 en Q1 2035"
            domain={domain}
          />
        </div>

        {/* Gap Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <MobileChartComponent
            data={getGapData(selectedData)}
              title="Match tussen arbeidsvraag en -aanbod"
              subtitle="Uitkomst Q1 2035"
            isGapChart={false} // Changed to false since charts are now independent
            domain={domain}
          />
        </div>

        {/* Demand Chart */}
        <div className="bg-white rounded-lg shadow-sm">
          <MobileChartComponent
            data={processRightData(getDemandData(selectedData))}
              title="Arbeidsvraag"
              subtitle="Ontwikkeling tussen Q1 2024 en Q1 2035"
            orientation="right"
            domain={domain}
          />
        </div>

        {/* Footnotes */}
        {footnotes.length > 0 && (
          <div className="mt-4 px-2">
            <FootnoteDisplay footnotes={footnotes}/>
          </div>
        )}
      </div>
    </div>
  );
};