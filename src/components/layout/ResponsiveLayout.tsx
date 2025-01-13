import { useState } from 'react';
import { MobileDrawer } from './MobileDrawer';
import { SettingsPanel } from '../settings/SettingsPanel';
import { MainContent } from '../visualization/MainContent';
import type { ModelSettings } from '@/types/settings';

const initialSettings: ModelSettings = {
  productivity: 1.0,
  steering: 'with',
  workHours: 'everyone',
  jobPriority: 'standard',
  nonSourceJobs: 'standard'
};

export const ResponsiveLayout = () => {
  const [settings, setSettings] = useState<ModelSettings>(initialSettings);

  const handleSettingChange = <K extends keyof ModelSettings>(
    key: K,
    value: ModelSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 flex flex-col h-full">
        <div className="border-b flex-shrink-0">
          <div className="flex h-16 items-center px-4">
            <MobileDrawer
              settings={settings}
              onSettingChange={handleSettingChange}
            />
            <h1 className="ml-4 text-lg font-semibold">Model Settings</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MainContent settings={settings} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-5 h-full">
        <div className="col-span-1 border-r p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Model Settings</h2>
          <SettingsPanel
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        </div>
        <div className="col-span-4 overflow-y-auto">
          <MainContent settings={settings} />
        </div>
      </div>
    </div>
  );
};