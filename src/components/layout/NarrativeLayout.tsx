import { useState } from 'react';
import { MainContent } from '../visualization/MainContent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    0% { box-shadow: 0 0 0 1px rgba(0,153,168, 0.2); }
    50% { box-shadow: 0 0 0 2px rgba(0,153,168, 0.2); }
    100% { box-shadow: 0 0 0 1px rgba(0,153,168, 0.2); }
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
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Floating Circles with Dialogs */}
      <div className="fixed top-8 left-8 z-50">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative w-16 h-16 rounded-full bg-[rgb(0,153,168)] flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <img 
                src="/denkwerk_logo.svg" 
                alt="Denkwerk Logo" 
                className="h-8 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Over Denkwerk</DialogTitle>
            </DialogHeader>
            {/* Content will be populated by you */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="fixed top-8 right-8 z-50">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative w-16 h-16 rounded-full bg-[rgb(0,153,168)] flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <Info className="h-8 w-8 text-white" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Informatie</DialogTitle>
            </DialogHeader>
            {/* Content will be populated by you */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Rest of the component remains the same */}
      <div className="w-full">
        {/* Hero Banner */}
        <div className="relative w-full h-[300px]">
          <img 
            src="/nl_from_above.jpg"
            alt="Netherlands by night"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-5xl font-bold mb-8">
              Arbeidsmarkt Transitiemodel
            </h1>
            <p className="text-xl max-w-3xl">
              Dit model laat zien hoe we de arbeidsmarkt het beste kunnen voorbereiden op toekomstige uitdagingen. 
              Door verschillende keuzes te maken kunnen we zien hoe de arbeidsmarkt zich ontwikkelt richting 2035.
            </p>
          </div>
        </div>

        {/* Main Content with partial grey background */}
        <div className="w-full">
          <div className="max-w-[2400px] mx-auto px-8 relative">
            {/* Grey background element */}
            <div className="absolute left-8 right-8 top-0 bottom-0 bg-white shadow-lg" />
            
            {/* Content */}
            <div className="relative max-w-7xl mx-auto space-y-8 pt-8 pb-12">
              {/* Rest of the content remains exactly the same */}
              <div>
                <p className="leading-relaxed">
                  We gaan uit van een jaarlijkse productiviteitsgroei van{' '}
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

              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Resultaten</h2>
                <MainContent settings={settings} />
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-600">
                  Meer weten?{' '}
                  <a
                    href="https://google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[rgb(0,153,168)] hover:text-[rgb(0,123,138)] underline"
                  >
                    Vind hier het volledige rapport
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NarrativeLayout;