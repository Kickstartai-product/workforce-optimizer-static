import React from 'react';
import { SettingControl } from './SettingControl';
import type { Setting } from '@/types/settings';

interface SettingsPanelProps {
  settings: Setting[];
  onSettingChange: (id: string, value: number) => void;
}

export const SettingsPanel = ({ settings, onSettingChange }: SettingsPanelProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {settings.map((setting) => (
          <SettingControl
            key={setting.id}
            setting={setting}
            onChange={(value) => onSettingChange(setting.id, value)}
          />
        ))}
      </div>
    </div>
  );
};