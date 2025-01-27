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
              <p className="text-gray-700 text-sm leading-relaxed mt-4">
                Om dat te bereiken doet DenkWerk haar eigen onderzoek, gebruikmakend van een breed netwerk van experts. Hiermee willen we vraagstukken grondig onderzoeken, structuur brengen en inspiratie aandragen voor acties of verder onderzoek.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mt-4">
                Om bij te dragen aan het maatschappelijk debat en verandering in gang te zetten, streven we ernaar de resultaten van ons werk in het publieke domein te delen. Dit geldt ook voor het gemaakte arbeidsmarkt-transitiemodel. Dit model is gemaakt met behulp van een samenwerking tussen DenkWerk en <a href="https://www.kickstart.ai/" target="_blank" rel="noopener noreferrer" className="text-[rgb(0,153,168)] hover:underline">Kickstart AI</a>.
              </p>
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
              <p className="text-gray-700 text-sm leading-relaxed">
                Om te analyseren of de dynamiek op de arbeidsmarkt zo groot gemaakt kan worden dat in de behoefte van de nieuwe economische structuren kan worden voorzien hebben wij een arbeidsmarkt-transitiemodel gebouwd.
              </p>

              <div>
                <h3 className="font-semibold text-l mb-2">Het model werkt als volgt:</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Een belangrijke parameter van het model is de ontwikkeling van de arbeidsproductiviteit (% per jaar). Deze parameter betreft de autonome arbeidsproductiviteitsgroei van sectoren en bepaalt in welke mate bestaande activiteiten met minder werknemers verricht kunnen worden. De werknemers die dan vrijkomen kunnen een wisseling maken naar een andere baan. Het model hanteert het uitgangspunt dat 20% van de jaarlijkse groei van de arbeidsproductiviteit resulteert in een vermindering van de arbeidsvraag, de overige 80% van de jaarlijkse groei vertaalt zich in een hogere output of hoger dienstverleningsniveau.
                </p>
                <p className="text-gray-700 leading-relaxed mt-2">
                  Het model zoekt voor de werknemers die beschikbaar zijn voor een baanwisseling naar de optimale uitkomst gegeven drie condities:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 text-sm">
                  <li>De arbeidsvraag voor onze maatschappelijke ambities moet zo veel als mogelijk worden ingevuld;</li>
                  <li>Het aantal baanwisselingen moet tot het minimum worden beperkt;</li>
                  <li>De baanwisselingen moet leiden tot een zo positief mogelijk effect op de arbeidsproductiviteit (structuureffecten).</li>
                </ul>
              </div>

              <div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  De O*Net 29.1 Database geeft aan de hand van een score op een 1-tot-5 puntsschaal informatie over de vaardigheden (bijvoorbeeld 'leesvaardigheid' en 'schrijfvaardigheid') en kenmerken (bijvoorbeeld 'kracht' en 'leeftijd') van een beroep in de Verenigde Staten. Met behulp van deze dataset is een koppeling gemaakt met de Nederlandse beroepsgroepen zoals gehanteerd door het CBS en ROA.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4 text-sm">
                  Voor alle indicatoren die we gebruiken om de vaardigheden en kenmerken te meten is een matrix opgesteld waarin de beroepsgroepen met elkaar worden vergeleken. Alleen wanneer de 'target group' (naar dit beroep gaat de werknemer toe) een hogere score heeft op een indicator dan de 'source group' (van dit beroep komt de werknemer vandaan), noteren we het verschil in score in de matrix. De optelsom van de scores per indicator leiden vervolgens tot een totaalscore voor zowel de vaardigheden als kenmerken. Deze scores worden gebruikt door het model om te bepalen of een baanwisseling tussen beroepsgroepen mogelijk is.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-l mb-2">Een baanwisseling is mogelijk als:</h3>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700 text-sm">
                  <li>De totaalscore op vaardigheden en kenmerken binnen een bepaalde range ligt.
                    De hoogte van de range is vastgesteld per beroep op basis van de diversiteit aan vooropleidingen (diverse opleidingsachtergrond = opleidingsrichting die door minder dan 2.5% van de mensen uit de beroepsgroep gevolgd is) en % mensen in de beroepsgroep dat maximaal middelbaar onderwijs volgt. De beroepsgroepen zijn vervolgens met behulp van data van het Arbeidsmarkt Informatie Systeem (AIS) ingedeeld in 'moeilijk' (veel omscholing nodig), 'medium' (met enige omscholing) en 'makkelijk' (met weinig omscholing). Per categorie wordt een verschillende range gehanteerd. De gedachte hierbij is dat het moeilijker is om iemand om te scholen naar arts dan naar bijvoorbeeld buschauffeur;</li>
                  <li>En een baanwisseling een vooruitgang in salaris betreft of een maximale daling van 10% (gerekend met het bruto uurloon). De keuze kan worden gemaakt om een tijdelijke compensatie aan te bieden in geval het een reductie van salaris betreft.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-l mb-2">Het model heeft naast de parameter arbeidsproductiviteit ook andere parameters:</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                  <li>
                    Wel of geen overheidssturing op het gewenste portfolio van economische activiteiten.
                    <ul className="list-disc pl-6 mt-2 text-sm">
                      <li>Wel overheidssturing betekent dat op basis van de methodiek gepresenteerd in Figuur 20 van de DenkWerk-rapportage 'KIEZEN én DELEN' (Hoofdstuk 6) een inschatting is gemaakt per type beroep of deze niet-locatiegebonden is en een lage toegevoegde waarde heeft. Indien dit het geval is, is een percentage daarvan (over het algemeen &lt;25%) beschikbaar gesteld voor een baanwisseling.</li>
                      <li>Geen overheidssturing betekent dat het wordt overgelaten aan de marktkrachten en enkel de uitbreidingsvraag voor onze grootste ambities (gebaseerd op Figuur 11 in Hoofdstuk 3 van de DenkWerk-rapportage 'KIEZEN én DELEN') is ingevoerd in het model.</li>
                    </ul>
                  </li>
                  <li>De mogelijkheid om de wekelijkse gemiddelde arbeidsduur met 2 uur te verlegen van niemand, alle werknemers, de deeltijdwerkers of de zorgmedewerkers.</li>
                  <li>De mogelijkheid om beroepsgroepen prioriteit te geven (het model probeert de vacatures voor deze beroepsgroepen als eerste in te vullen).</li>
                  <li>De mogelijkheid om beroepsgroepen aan te geven waarvan de medewerkers niet beschikbaar zijn voor een baanwisseling (hier hebben we bijvoorbeeld juist mensen nodig).</li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4 text-sm">
                Zie Hoofdstuk 7 van het DenkWerk-rapport 'KIEZEN én DELEN' voor onze analyses (getoetste situaties) en inzichten met behulp van het arbeidsmarkt-transitiemodel.
              </p>
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
          {/* Photo credit */}
          <div className="absolute bottom-2 left-2 text-white text-[10px] sm:text-xs bg-black/50 px-2 py-0 rounded">
            Foto: ©ESA/NASA - André Kuipers
          </div>
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-3xl font-bold mb-4" style={getAnimationStyle(0)}>
              Arbeidsmarkt-transitiemodel
            </h1>
            <p className="text-base max-w-3xl" style={getAnimationStyle(200)}>
              Dit model geeft inzicht in welke mate voorzien kan worden in de toekomstige vraag naar arbeid voor onze ambities. Met behulp van een aantal parameters die kunnen worden aangepast wordt de ontwikkeling van vraag en aanbod op de arbeidsmarkt getoond tussen Q1 2024 en Q1 2035.
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
                          Dit betreft autonome groei, dus de groei van de arbeidsproductiviteit binnen bedrijfstakken. De mate van groei van de arbeidsproductiviteit beïnvloedt de toekomstige arbeidsvraag. Het uitgangspunt wordt gehanteerd dat 20% van de jaarlijkse groei resulteert in een verlaging van het aantal benodigde medewerkers en de overige 80% leidt tot een hogere output of hoger dienstverleningsniveau.
                        </p>
                      </div>
                    </div>
                    <div style={getAnimationStyle(500)} className="space-y-4">
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
                        Actieve sturing betekent dat de overheid de arbeidsvraag voor bepaalde beroepsgroepen gericht vermindert. Wanneer dit niet het geval is, wordt de richting van de baanwisselingen overgelaten aan de marktkrachten.
                      </p>
                    </div>
                    <div style={getAnimationStyle(600)} className="space-y-4">
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
                        De vraag naar nieuwe medewerkers kan gedeeltelijk worden verminderd wanneer de werkweek van specifieke medewerkers met twee uur wordt verlengd.
                      </p>
                    </div>
                    <div style={getAnimationStyle(700)}>
                      <p className="leading-relaxed font-medium">
                        Er wordt in ieder geval niet van baan gewisseld door werknemers die werken in{' '}
                        <InlineSelect
                          value={settings.nonSourceJobs}
                          options={[
                            { value: 'standard', label: 'een mix van verschillende sectoren' },
                            { value: 'ambitious-and-education', label: 'ambitiesectoren en onderwijs' },
                            { value: 'ambitious-only', label: 'alleen ambitiesectoren' }
                          ]}
                          onChange={(value) => handleSettingChange('nonSourceJobs', value as ModelSettings['nonSourceJobs'])}
                        />.
                      </p>
                      <p className="text-sm text-gray-500 mt-1 ml-6 italic">
                        Ambitiesectoren: beroepen gerelateerd aan de zes grote ambities beschreven in de DenkWerk-rapportage (onder andere in de bouw- en infrasector, defensie en de zorg); Onderwijs: alle beroepen die gerelateerd zijn aan onderwijs (zoals docenten en onderwijsassistenten); Mix van verschillende sectoren: betreft een selectie van beroepen in onder andere de bouw- en infrasector, defensie, zorg, het onderwijs en veiligheid (politie, brandweer, ed.))
                      </p>
                    </div>
                    <div style={getAnimationStyle(750)} className="space-y-4">
                      <p className="text-sm leading-relaxed font-medium">
                        Er wordt prioriteit gegeven aan het invullen van de vacatures voor{' '}
                        <InlineSelect
                          value={settings.jobPriority}
                          options={[
                            { value: 'standard', label: 'een gebalanceerde mix van sectoren' },
                            { value: 'defense', label: 'defensie' },
                            { value: 'infrastructure', label: 'bouw, infra en klimaat' },
                            { value: 'healthcare', label: 'gezondheidszorg' }
                          ]}
                          onChange={(value) => handleSettingChange('jobPriority', value as ModelSettings['jobPriority'])}
                        />.
                      </p>
                      <p className="text-xs text-gray-500 mt-1 ml-4 italic">
                        De prioritering van sectoren beïnvloedt waar werknemers die vrijkomen op de arbeidsmarkt naartoe worden gestimuleerd
                      </p>
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
                      href="https://denkwerk.online/rapporten/kiezen-en-delen-januari-2025/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgb(0,153,168)] hover:text-[rgb(0,123,138)] underline"
                    >
                      Vind hier het volledige rapport
                    </a>.
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