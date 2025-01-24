import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModelSettings } from '@/types/settings';
import { DataLoader } from '@/utils/dataLoader';
import { generateSettingsKey } from '@/types/results';
import type { TransformedResult } from '@/types/results';
import { ShortageBarChart } from './ShortageBarChart';
import { TransitionsChart } from "./TransitionsChart";
import { DualWaterfall } from './Waterfall/DualWaterfall';
import { MetricCard } from './MetricCard';
import { useWindowSize, MOBILE_BREAKPOINT } from '@/hooks/useWindowSize'
import { MobileDualWaterfall } from './Waterfall/MobileWaterfallChart';
import { MobileTransitionsChart } from './MobileTransitionsChart';

interface ChartCardProps {
  title: string;
  description: string;
  isInitialized: boolean;
  resultData: TransformedResult | null;
  isWaterfall?: boolean;
  children: (data: TransformedResult) => React.ReactNode;
}

const ChartCard = ({
  title,
  description,
  isInitialized,
  resultData,
  isWaterfall = false,
  children
}: ChartCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className={isWaterfall ? "h-144" : "h-96"}>
        {!isInitialized ? (
          <div className="flex items-center justify-center h-full">
            Initializing...
          </div>
        ) : resultData ? (
          children(resultData)
        ) : (
          <div className="flex items-center justify-center h-full">
            No data available for these settings
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

interface MainContentProps {
  settings: ModelSettings;
}

export const MainContent = ({ settings }: MainContentProps) => {
  const [resultData, setResultData] = useState<TransformedResult | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeLoader = async () => {
      const loader = DataLoader.getInstance();
      await loader.initialize();
      setIsInitialized(true);
    };

    initializeLoader();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const loader = DataLoader.getInstance();
    const settingsKey = generateSettingsKey(settings);
    const result = loader.getResultForSettings(settingsKey);
    
    if (result) {
      const transformedResult = loader.transformResult(result);
      setResultData(transformedResult);
    } else {
      setResultData(null);
    }
  }, [settings, isInitialized]);

  const charts = [
    {
      title: "Projectie van de arbeidsmarkt",
      description: "Ontwikkeling van de arbeidsvraag en het arbeidsaanbod tussen Q1 2024 en Q1 2035 en de mate waarin dit op elkaar aansluit als gevolg van de baanwisselingen",
      component: (data: TransformedResult) => {
        const windowWidth = useWindowSize()
        
        // Handle SSR case
        if (windowWidth === null) return null;
        
        return windowWidth < MOBILE_BREAKPOINT ? (
          <MobileDualWaterfall 
            data={data.workforceChanges}
            className="mt-8"
          />
        ) : (
          <DualWaterfall 
            data={data.workforceChanges}
            className="mt-8"
          />
        );
      },
      isWaterfall: true
    },
    {
      title: "Top 10 baanwisselingen",
      description: "Toont de grootste verschuivingen tussen beroepen",
      component: (data: TransformedResult) => {
        const windowWidth = useWindowSize()
        
        if (windowWidth === null) return null;
        
        return windowWidth < MOBILE_BREAKPOINT ? (
          <MobileTransitionsChart data={data} />
        ) : (
          <TransitionsChart data={data} />
        );
      },
      isWaterfall: false
    },
    {
      title: "Top 10 beroepen met niet ingevulde vacatures in 2035",
      description: "Toont de beroepen met het grootste aantal openstaande vacatures in Q1 2035 ondanks de baanwisselingen",
      component: (data: TransformedResult) => <ShortageBarChart data={data} />,
      isWaterfall: false
    }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <MetricCard
          title="Totaal aantal transities"
          description="Het totale aantal werknemers dat van beroep wisselt"
          value={resultData?.workforceChanges['Totaal'].transitions_in ?? null}
        />
        <MetricCard
          title="Overgebleven tekort"
          description="Het aantal vacatures dat niet vervuld kan worden na optimale arbeidsmarkttransities"
          value={resultData?.workforceChanges['Totaal'].shortage ?? null}
        />
        <MetricCard
          title="Toename toegevoegde waarde"
          description="De procentuele stijging in toegevoegde waarde per jaar wanneer de tekorten zijn opgelost"
          value={resultData?.addedValueChangePercent ?? null}
          isPercentage
        />
      </div>
      <div className="space-y-8">
        {charts.map((chart, index) => (
          <ChartCard
            key={index}
            title={chart.title}
            description={chart.description}
            isInitialized={isInitialized}
            resultData={resultData}
            isWaterfall={chart.isWaterfall}
          >
            {chart.component}
          </ChartCard>
        ))}
      </div>
    </div>
  );
};

export default MainContent;