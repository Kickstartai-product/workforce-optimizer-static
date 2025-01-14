import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModelSettings } from '@/types/settings';
import { DataLoader } from '@/utils/dataLoader';
import { generateSettingsKey } from '@/types/results';
import { useEffect, useState } from "react";
import type { TransformedResult } from '@/types/results';
import { ShortageBarChart } from './ShortageBarChart';
import { TransitionsChart } from "./TransitionsChart";

interface MainContentProps {
  settings: ModelSettings;
}

export const MainContent = ({ settings }: MainContentProps) => {
  const [resultData, setResultData] = useState<TransformedResult | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // One-time initialization
  useEffect(() => {
    console.log('yeaah')
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <div className="space-y-8">
        {/* Shortages Card */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Job Shortages</CardTitle>
            <CardDescription>
              Showing the largest remaining shortages across all jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {!isInitialized ? (
                <div className="flex items-center justify-center h-full">
                  Initializing...
                </div>
              ) : resultData ? (
                <ShortageBarChart data={resultData} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  No data available for these settings
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transitions Card */}
        {resultData && (
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Workforce Transitions</CardTitle>
              <CardDescription>
                Showing the largest transitions between jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <TransitionsChart data={resultData} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};