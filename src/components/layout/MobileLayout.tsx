import { useState, useEffect } from 'react';
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

const ANIMATION_DURATION = 1000;

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

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const InlineSelect = ({
  value,
  options,
  onChange,
  className = '',
  style = {}
}: {
  value: string | number,
  options: { value: string | number, label: string }[],
  onChange: (value: string | number) => void,
  className?: string,
  style?: React.CSSProperties
}) => (
  <span className="inline-block" style={style}>
    <style>{pulseAnimation}</style>
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v) || v)}>
      <SelectTrigger
        className={`
          inline-flex w-auto min-w-0 h-6 px-1 py-0 
          text-sm bg-transparent border-none rounded 
          whitespace-nowrap cursor-pointer font-medium
          relative
          animate-[subtle-pulse_3s_ease-in-out_infinite]
          hover:bg-blue-50
          ${className}
        `}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-w-[90vw]">
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)} className="text-sm font-medium">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </span>
);

export const MobileLayout = () => {
  const [settings, setSettings] = useState<ModelSettings>(initialSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSettingChange = <K extends keyof ModelSettings>(
    key: K,
    value: ModelSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const basePath = import.meta.env.BASE_URL;

  const getAnimationStyle = (delay: number) => ({
    opacity: 0,
    animation: mounted ? `fadeIn ${ANIMATION_DURATION}ms ease-out forwards ${delay}ms` : 'none'
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Floating Buttons - Adjusted for mobile */}
      <div className="fixed top-4 left-4 z-50">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative w-12 h-12 rounded-full bg-[rgb(0,153,168)] flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <img
                src={`${basePath}denkwerk_logo.svg`}
                alt="Denkwerk Logo"
                className="h-6 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white m-2">
            <DialogHeader>
              <DialogTitle className="text-lg">Over Denkwerk</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                <a href="https://denkwerk.online/" target="_blank" rel="noopener noreferrer" className="text-[rgb(0,153,168)] hover:underline">DenkWerk</a> is een onafhankelijke denktank die met krachtige ideeën bij wil dragen aan een welvarend, inclusief en vooruitstrevend Nederland.
              </p>
              {/* ... rest of the dialog content with text-sm class ... */}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <Info className="h-6 w-6 text-white" />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white m-2">
            <DialogHeader>
              <DialogTitle className="text-lg">Toelichting model</DialogTitle>
            </DialogHeader>
            <div className="p-4 space-y-4">
              {/* ... dialog content with text-sm class ... */}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full">
        {/* Hero Banner - Adjusted for mobile */}
        <div className="relative w-full h-[300px]">
          <img
            src={`${basePath}nl_from_above.jpg`}
            alt="Netherlands by night"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-3xl font-bold mb-4" style={getAnimationStyle(0)}>
              Arbeidsmarkt-transitiemodel
            </h1>
            <p className="text-base max-w-3xl" style={getAnimationStyle(200)}>
            Dit model geeft inzicht in welke mate voorzien kan worden in de toekomstige vraag naar arbeid als gevolg van baanwisselingen. Met behulp van een aantal parameters die kunnen worden aangepast wordt de ontwikkeling van vraag en aanbod op de arbeidsmarkt getoond tussen Q1 2024 en Q1 2035.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="mx-auto px-4">
            <div className="bg-white shadow-lg">
              <div className="relative px-4 pt-8 pb-12">
                {/* Settings Section */}
                <div 
  className="relative pt-8 border-t border-gray-200"
  style={getAnimationStyle(300)}
>
  {/* Increase padding and adjust positioning of the label */}
  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-2">
    <h2 className="text-xl font-semibold text-[rgb(0,153,168)] whitespace-nowrap">Kies hier uw situatie</h2>
  </div>

                  <div className="space-y-6 mb-8">
                    {/* Settings content with smaller text and spacing */}
                    <div style={getAnimationStyle(400)} className="space-y-4">
                      {/* Productivity setting */}
                      <div>
                        <p className="text-sm leading-relaxed font-medium">
                          De jaarlijkse groei van de arbeidsproductiviteit tussen 2024 en 2035 is{' '}
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
                        <p className="text-xs text-gray-500 mt-1 ml-4 italic">
                        Dit betreft autonome groei, dus de groei van de arbeidsproductiviteit binnen bedrijfstakken. De mate van groei van de arbeidsproductiviteit beïnvloedt de toekomstige arbeidsvraag. Het uitgangspunt wordt gehanteerd dat 20% van de jaarlijkse groei resulteert in een verlaging van de arbeidsvraag en de overige 80% leidt tot een hogere output of hoger dienstverleningsniveau.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm leading-relaxed font-medium">
                        De richting van de baanwisselingen wordt{' '}
                        <InlineSelect
                        value={settings.steering}
                        options={[
                            { value: 'with', label: 'actief gestuurd door de overheid' },
                            { value: 'without', label: 'voornamelijk bepaald door de markt' }
                        ]}
                        onChange={(value) => handleSettingChange('steering', value as ModelSettings['steering'])}
                        />.
                        </p>
                        <p className="text-xs text-gray-500 mt-1 ml-4 italic">
                    Actieve sturing betekent dat de overheid de arbeidsvraag voor bepaalde beroepen gericht vermindert. Wanneer dit niet het geval is, wordt het overgelaten aan de marktkrachten.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm leading-relaxed font-medium">
                    De gemiddelde duur van de werkweek wordt met 2 uur verlengd bij{' '}
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
                        <p className="text-xs text-gray-500 mt-1 ml-4 italic">
                        De arbeidsvraag kan gedeeltelijk worden verminderd wanneer de werkweek van specifieke medewerkers met twee uur wordt verlengd.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm leading-relaxed font-medium">
                    Er wordt prioriteit gegeven aan het invullen van de vacatures voor{' '}
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
                        <p className="text-xs text-gray-500 mt-1 ml-4 italic">
                        De prioritering van sectoren beïnvloedt werknemers die vrijkomen op de arbeidsmarkt naartoe worden gestimuleerd
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div
                  className="relative pt-8 mt-8 border-t border-gray-200"
                  style={getAnimationStyle(800)}
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-4">
                    <h2 className="text-xl font-semibold text-[rgb(0,153,168)]">Resultaten</h2>
                  </div>

                  <MainContent settings={settings} />
                </div>

                <div className="text-center mt-8" style={getAnimationStyle(900)}>
                  <p className="text-sm text-gray-600">
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
    </div>
  );
};

export default MobileLayout;