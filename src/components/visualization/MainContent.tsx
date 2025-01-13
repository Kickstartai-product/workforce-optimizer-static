import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ModelSettings } from '@/types/settings';
import { DataLoader } from '@/utils/dataLoader';
import { generateSettingsKey } from '@/types/results';
import { useEffect, useState } from "react";
import type { TransformedResult } from '@/types/results';
import { ShortageBarChart } from './ShortageBarChart';


interface MainContentProps {
  settings: ModelSettings;
}

export const MainContent = ({ settings }: MainContentProps) => {
    // Properly type the state with the interface, making it nullable
    const [resultData, setResultData] = useState<TransformedResult | null>(null);
  
    useEffect(() => {
      const loadData = async () => {
        const loader = DataLoader.getInstance();
        await loader.initialize();
        
        const settingsKey = generateSettingsKey(settings);
        const result = loader.getResultForSettings(settingsKey);
        console.log(result)
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
          
          {/* Removed grid in favor of full-width layout */}
          <div className="space-y-4">
            <Card className="w-full min-h-[600px]"> {/* Increased minimum height */}
              <CardHeader>
                <CardTitle>Top 10 Job Shortages</CardTitle>
                <CardDescription>
                  Showing the largest remaining shortages across all jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 h-[500px]"> {/* Fixed height for the content area */}
                {resultData ? (
                  <ShortageBarChart data={resultData} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    Loading...
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* You can add more cards here for other visualizations */}
          </div>
        </div>
      );
    };