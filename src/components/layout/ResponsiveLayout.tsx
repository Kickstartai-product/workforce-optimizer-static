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
      {/* Shared MainContent */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile Header - only shown on mobile */}
        <div className="lg:hidden border-b flex-shrink-0">
          <div className="flex h-16 items-center px-4">
            <MobileDrawer
              settings={settings}
              onSettingChange={handleSettingChange}
            />
            <h1 className="ml-4 text-lg font-semibold">Model Settings</h1>
          </div>
        </div>

        {/* Desktop Sidebar - only shown on desktop */}
        <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-1/5 border-r p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Model Settings</h2>
          <SettingsPanel
            settings={settings}
            onSettingChange={handleSettingChange}
          />
        </div>

        {/* MainContent - shared between layouts with different positioning */}
        <div className="flex-1 overflow-y-auto lg:ml-[20%]">
          <MainContent settings={settings} />
        </div>
      </div>
    </div>
  );
};