import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModelSettings } from '@/types/settings';
import { DataLoader } from '@/utils/dataLoader';
import { generateSettingsKey } from '@/types/results';
import { useEffect, useState } from "react";
import type { TransformedResult } from '@/types/results';
import { ShortageBarChart } from './ShortageBarChart';
import { TransitionsChart } from "./TransitionsChart";
import { DualWaterfall } from './DualWaterfall';

interface MainContentProps {
  settings: ModelSettings;
}

interface ChartCardProps {
  title: string;
  description: string;
  isInitialized: boolean;
  resultData: TransformedResult | null;
  children: (data: TransformedResult) => React.ReactNode;
}

const ChartCard = ({ title, description, isInitialized, resultData, children }: ChartCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[400px]">
        {!isInitialized ? (
          <div className="flex items-center justify-center h-full">
            Initializing...
          </div>
        ) : resultData ? (
          children(resultData)
        ) : (
          <div className="flex items-center justify-center h-full">
            No data available for these settings
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const MainContent = ({ settings }: MainContentProps) => {
  const [resultData, setResultData] = useState<TransformedResult | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // One-time initialization
  useEffect(() => {
    const initializeLoader = async () => {
      const loader = DataLoader.getInstance();
      await loader.initialize();
      setIsInitialized(true);
    };

    initializeLoader();
  }, []); // Empty dependency array ensures this runs only once

  // Update results when settings change or after initialization
  useEffect(() => {
    if (!isInitialized) return;

    const loader = DataLoader.getInstance();
    const settingsKey = generateSettingsKey(settings);
    const result = loader.getResultForSettings(settingsKey);
    
    if (result) {
      const transformedResult = loader.transformResult(result);
      setResultData(transformedResult);
    } else {
      setResultData(null);
    }
  }, [settings, isInitialized]);

  const charts = [
    {
      title: "Top 10 Job Shortages",
      description: "Showing the largest remaining shortages across all jobs",
      component: (data: TransformedResult) => <ShortageBarChart data={data} />
    },
    {
      title: "Top 10 Workforce Transitions",
      description: "Showing the largest transitions between jobs",
      component: (data: TransformedResult) => <TransitionsChart data={data} />
    },
    {
      title: "Waterfall Chart of Numbers",
      description: "Showing the largest transitions between jobs",
      component: (data: TransformedResult) => (
        <DualWaterfall 
          data={data.workforceChanges.Accountants}
          className="mt-8"
        />
      )
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <div className="space-y-8">
        {charts.map((chart, index) => (
          <ChartCard
            key={index}
            title={chart.title}
            description={chart.description}
            isInitialized={isInitialized}
            resultData={resultData}
          >
            {chart.component}
          </ChartCard>
        ))}
      </div>
    </div>
  );
};