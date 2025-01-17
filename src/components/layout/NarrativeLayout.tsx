import { useState } from 'react';
import { MainContent } from '../visualization/MainContent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ModelSettings } from '@/types/settings';

const initialSettings: ModelSettings = {
  productivity: 1.0,
  steering: 'with',
  workHours: 'everyone',
  jobPriority: 'standard',
  nonSourceJobs: 'standard'
};

const pulseAnimation = `
  @keyframes subtle-pulse {
    0% { box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1); }
    50% { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25); }
    100% { box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1); }
  }
`;

const InlineSelect = ({ 
  value, 
  options, 
  onChange,
  className = ''
}: { 
  value: string | number, 
  options: { value: string | number, label: string }[],
  onChange: (value: string | number) => void,
  className?: string
}) => (
  <span className="inline-block">
    <style>{pulseAnimation}</style>
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v) || v)}>
      <SelectTrigger 
        className={`
          inline-flex w-auto min-w-0 h-6 px-1 py-0 
          text-base bg-transparent border-none rounded 
          whitespace-nowrap cursor-pointer
          relative
          animate-[subtle-pulse_3s_ease-in-out_infinite]
          hover:bg-blue-50
          ${className}
        `}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </span>
);

export const NarrativeLayout = () => {
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
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-6 py-4">
        <div className="max-w-[90ch] mx-auto">
          <h1 className="text-xl font-semibold mb-4">Arbeidsmarkt Transitiemodel 2035</h1>
          
          <div className="space-y-4">
            <div>
              <p className="leading-relaxed">
                In dit model van de Nederlandse arbeidsmarkt richting 2035 gaan we uit van een jaarlijkse 
                productiviteitsgroei van{' '}
                <InlineSelect
                  value={settings.productivity}
                  options={[
                    { value: 0.5, label: '0,5%' },
                    { value: 1.0, label: '1,0%' },
                    { value: 1.5, label: '1,5%' }
                  ]}
                  onChange={(value) => handleSettingChange('productivity', value as ModelSettings['productivity'])}
                />.
              </p>
              <p className="text-sm text-gray-500 mt-1 ml-6 italic">
                Een hogere productiviteitsgroei betekent dat dezelfde economische output met minder arbeid kan worden bereikt,
                wat de arbeidsmarkt ontlast maar ook minder werkgelegenheid creëert.
              </p>
            </div>

            <div>
              <p className="leading-relaxed">
                Deze transitie wordt{' '}
                <InlineSelect
                  value={settings.steering}
                  options={[
                    { value: 'with', label: 'actief gestuurd door de overheid' },
                    { value: 'without', label: 'voornamelijk bepaald door de markt' }
                  ]}
                  onChange={(value) => handleSettingChange('steering', value as ModelSettings['steering'])}
                />.
              </p>
              <p className="text-sm text-gray-500 mt-1 ml-6 italic">
                Overheidssturing betekent gerichte interventies in de arbeidsmarkt via wet- en regelgeving, 
                terwijl marktwerking uitgaat van natuurlijke aanpassingen door vraag en aanbod.
              </p>
            </div>

            <div>
              <p className="leading-relaxed">
                We richten ons op arbeidsduurverandering bij{' '}
                <InlineSelect
                  value={settings.workHours}
                  options={[
                    { value: 'everyone', label: 'alle werknemers' },
                    { value: 'part-time', label: 'deeltijdwerkers' },
                    { value: 'healthcare', label: 'zorgmedewerkers' }
                  ]}
                  onChange={(value) => handleSettingChange('workHours', value as ModelSettings['workHours'])}
                />.
              </p>
              <p className="text-sm text-gray-500 mt-1 ml-6 italic">
                De keuze voor een specifieke doelgroep bepaalt de impact en haalbaarheid van arbeidsduurveranderingen,
                waarbij verschillende groepen verschillende uitdagingen en kansen bieden.
              </p>
            </div>

            <div>
              <p className="leading-relaxed">
                De beschikbare arbeidscapaciteit wordt met prioriteit ingezet voor{' '}
                <InlineSelect
                  value={settings.jobPriority}
                  options={[
                    { value: 'standard', label: 'een gebalanceerde mix van sectoren' },
                    { value: 'defense', label: 'defensie' },
                    { value: 'healthcare', label: 'de zorgsector' },
                    { value: 'infrastructure', label: 'infrastructuur en klimaat' }
                  ]}
                  onChange={(value) => handleSettingChange('jobPriority', value as ModelSettings['jobPriority'])}
                />.
              </p>
              <p className="text-sm text-gray-500 mt-1 ml-6 italic">
                De prioritering van sectoren beïnvloedt waar arbeidscapaciteit het eerst wordt ingezet,
                wat gevolgen heeft voor de ontwikkeling van andere sectoren.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <MainContent settings={settings} />
        </div>
      </div>
    </div>
  );
};

export default NarrativeLayout;