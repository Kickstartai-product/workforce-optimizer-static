import React from 'react';
import { Slider } from "@/components/ui/slider";
import type { Setting } from '@/types/settings';

interface SettingControlProps {
  setting: Setting;
  onChange: (value: number) => void;
}

export const SettingControl = ({ setting, onChange }: SettingControlProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{setting.label}</label>
      <Slider
        defaultValue={[setting.value]}
        min={setting.min ?? 0}
        max={setting.max ?? 100}
        step={setting.step ?? 1}
        onValueChange={([value]) => onChange(value)}
      />
    </div>
  );
};
