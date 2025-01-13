import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsBarChart } from './SettingsBarChart';
import type { Setting } from '@/types/settings';

interface MainContentProps {
  settings: Setting[];
}

export const MainContent = ({ settings }: MainContentProps) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Visualization</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Settings Values</CardTitle>
            <CardDescription>
              Current values for all settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsBarChart settings={settings} />
          </CardContent>
        </Card>
        
        {/* You can add more Cards here with different visualizations */}
        {/* Example:
        <Card>
          <CardHeader>
            <CardTitle>Another Visualization</CardTitle>
            <CardDescription>Description here</CardDescription>
          </CardHeader>
          <CardContent>
            <AnotherChart settings={settings} />
          </CardContent>
        </Card>
        */}
      </div>
    </div>
  );
};