import { useState } from 'react';
import { MainContent } from '../visualization/MainContent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ModelSettings } from '@/types/settings';

const initialSettings: ModelSettings = {
  productivity: 1.0,
  steering: 'with',
  workHours: 'noone',
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
    <div className="bg-gray-50">
      <div className="p-4">
        <div className="max-w-[90ch] mx-auto">
          <h1 className="text-xl font-semibold mb-4">Arbeidsmarkt Transitiemodel</h1>

          <div className="space-y-4">
            <div>
              <p className="leading-relaxed">
                Dit model laat zien hoe we de arbeidsmarkt het beste kunnen voorbereiden op toekomstige uitdagingen.
                Door verschillende keuzes te maken kunnen we zien hoe de arbeidsmarkt zich ontwikkelt richting 2035.<br /><br />
              </p>
              <p className="leading-relaxed">

                We uit van een jaarlijkse productiviteitsgroei van{' '}
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
                wat de arbeidsmarkt ontlast. We hanteren als uitgangspunt dat 20% van de productiviteitswinst wordt vertaald naar een afbouw van activiteiten.
              </p>
            </div>

            <div>
              <p className="leading-relaxed">
                De Arbeidsmarkt­transities worden{' '}
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
                    { value: 'noone', label: 'niemand' },
                    { value: 'everyone', label: 'alle werknemers' },
                    { value: 'part-time', label: 'deeltijdwerkers' },
                    { value: 'healthcare', label: 'zorgmedewerkers' }
                  ]}
                  onChange={(value) => handleSettingChange('workHours', value as ModelSettings['workHours'])}
                />.
              </p>
              <p className="text-sm text-gray-500 mt-1 ml-6 italic">
              De arbeidsmarkt wordt deels ontlast wanneer de werkweek in specifieke sectoren met twee uur wordt verlengd.
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
        <h2 className="text-xl font-semibold mb-4">Resultaten</h2>
          <MainContent settings={settings} />
        </div>

        <div className="max-w-[90ch] mx-auto mt-8 text-center">
          <p className="text-gray-600">
            Meer weten?{' '}
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Vind hier het volledige rapport
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NarrativeLayout;