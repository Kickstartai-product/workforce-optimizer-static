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

  useEffect(() => {
    const loadData = async () => {
      const loader = DataLoader.getInstance();
      await loader.initialize();

      const settingsKey = generateSettingsKey(settings);
      const result = loader.getResultForSettings(settingsKey);
      if (result) {
        const transformedResult = loader.transformResult(result);
        setResultData(transformedResult);
      }
    };

    loadData();
  }, [settings]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <div className="space-y-8"> {/* Consistent spacing between cards */}
        {/* Shortages Card */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Job Shortages</CardTitle>
            <CardDescription>
              Showing the largest remaining shortages across all jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]"> {/* Fixed height container */}
              {resultData ? (
                <ShortageBarChart data={resultData} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  Loading...
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
              <div className="h-[400px]"> {/* Fixed height container */}
                <TransitionsChart data={resultData} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};