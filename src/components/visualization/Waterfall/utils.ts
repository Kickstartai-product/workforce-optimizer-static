import type { ChartData } from './types';
import type { WorkforceMetrics } from '@/types/results';

const roundSmallValues = (value: number): number => {
  return Math.abs(value) < 20 ? 0 : value;
};

export const formatNumber = (value: number): string => {
  const roundedValue = roundSmallValues(value);
  if (roundedValue === 0) return "0";
  if (Math.abs(roundedValue) === 0) return roundedValue < 0 ? "-0" : "0";

  const absValue = Math.abs(roundedValue);
  if (absValue >= 1000000) {
    return `${roundedValue < 0 ? '-' : ''}${(absValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    return `${roundedValue < 0 ? '-' : ''}${(absValue / 1000).toFixed(0)}K`;
  }
  return `${roundedValue < 0 ? '-' : ''}${absValue.toLocaleString()}`;
};

export const determineIncrement = (maxValue: number): number => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));

  if (maxValue < 100) {
    return maxValue <= 50 ? 5 : 10;
  }

  const possibleIncrements = [
    magnitude / 5,
    magnitude / 2,
    magnitude,
    magnitude * 2,
    magnitude * 5
  ];

  return possibleIncrements.find(inc => maxValue / inc <= 8) || magnitude;
};

export const roundUpToNice = (value: number, increment: number): number => {
  const rawRounded = Math.ceil(value / increment) * increment;
  const maxAllowed = value * 1.2;
  return Math.min(rawRounded, maxAllowed);
};

export const processLeftData = (data: ChartData[]): ChartData[] => {
  let total = 0;
  return data.map((item, index) => {
    const base = total;
    const roundedValue = roundSmallValues(item.value);
    total += roundedValue;
    return {
      ...item,
      value: roundedValue,
      displayValue: roundedValue,
      base,
      total,
      uniqueId: `left-${index}`
    };
  });
};

export const processRightData = (data: ChartData[]): ChartData[] => {
  const roundedData = data.map(item => ({
    ...item,
    value: roundSmallValues(item.value),
    displayValue: roundSmallValues(item.value)
  }));
  let total = roundedData.reduce((sum, item) => sum + item.value, 0);
  
  return roundedData.map((item, index) => {
    total -= item.value;
    return {
      ...item,
      base: total,
      total: total + item.value,
      uniqueId: `right-${index}`
    };
  });
};

export const getSupplyData = (selectedData: WorkforceMetrics): ChartData[] => {
  return [
    {
      name: "Arbeidsaanbod (2024)",
      value: roundSmallValues(Math.round(selectedData.labor_supply)),
      displayValue: roundSmallValues(Math.round(selectedData.labor_supply)),
      xValue: 1
    },
    {
      name: "Instroom minus uitstroom (tot 2035)",
      value: roundSmallValues(Math.round(selectedData.net_labor_change)),
      displayValue: roundSmallValues(Math.round(selectedData.net_labor_change)),
      xValue: 2
    }
  ];
};

export const getDemandData = (selectedData: WorkforceMetrics): ChartData[] => {
  return [
    {
      name: "geprojecteerde groei door productiviteit",
      value: roundSmallValues(Math.round(selectedData.productivity)),
      displayValue: roundSmallValues(Math.round(selectedData.productivity)),
      xValue: 1
    },
    {
      name: "Uitbreidsvraag",
      value: roundSmallValues(Math.round(selectedData.expansion_demand)),
      displayValue: roundSmallValues(Math.round(selectedData.expansion_demand)),
      xValue: 2
    },
    {
      name: "inkrimpingsvraag",
      value: roundSmallValues(Math.round(selectedData.reduction_demand)),
      displayValue: roundSmallValues(Math.round(selectedData.reduction_demand)),
      xValue: 3
    },
    {
      name: "Vacatures boven 2% frictie",
      value: roundSmallValues(Math.round(selectedData.vacancies)),
      displayValue: roundSmallValues(Math.round(selectedData.vacancies)),
      xValue: 4,
      footnote: "We gaan ervanuit dat er altijd 2% frictiewerkloosheid zal zijn. We rekenen daarom alleen vacatures boven de 2% mee.",
      footnoteNumber: 2
    },
    {
      name: "Ingevulde arbeidsvraag (2024)",
      value: roundSmallValues(Math.round(selectedData.labor_supply)),
      displayValue: roundSmallValues(Math.round(selectedData.labor_supply)),
      xValue: 5
    }
  ];
};

export const getGapData = (selectedData: WorkforceMetrics): ChartData[] => {
  const total_supply = selectedData.labor_supply +
    selectedData.net_labor_change;

  const total_demand = selectedData.labor_supply +
    selectedData.vacancies +
    selectedData.expansion_demand +
    selectedData.reduction_demand +
    selectedData.productivity;

  const superfluous_with_transitions = selectedData.superfluous_workers - 
    selectedData.transitions_out;

  return [
    {
      name: "Arbeidsaanbod (in 2035)",
      value: roundSmallValues(Math.round(total_supply)),
      displayValue: roundSmallValues(Math.round(total_supply)),
      isFinalProjection: true,
      base: 0,
      xValue: 1
    },
    {
      name: "Overtollig geraakt (tussen 2024 en 2035)",
      value: roundSmallValues(Math.round(superfluous_with_transitions) * -1),
      displayValue: roundSmallValues(Math.round(superfluous_with_transitions) * -1),
      isExcessWorkers: true,
      base: Math.round(total_supply),
      xValue: 2,
      footnote: "Een medewerker is overtollig als het niet lukt om een passende transitie te maken naar een nieuwe baan, terwijl de huidige baan niet meer  is benodigd vanwege productiviteitsstijging of sturing op afbouw van deze activiteit.",
      footnoteNumber: 1,
    },
    {
      name: "Van baan gewisseld (tussen 2024 en 2035)",
      value: roundSmallValues(Math.round(selectedData.transitions_in)),
      displayValue: roundSmallValues(Math.round(selectedData.transitions_in)),
      isShortageReduction: true,
      base: total_supply - superfluous_with_transitions,
      xValue: 3
    },
    {
      name: "Resterend tekort (in 2035)",
      value: roundSmallValues(Math.round(selectedData.shortage)),
      displayValue: roundSmallValues(Math.round(selectedData.shortage)),
      isShortage: true,
      base: total_supply - superfluous_with_transitions + selectedData.transitions_in,
      xValue: 4
    },
    {
      name: "Arbeidsvraag (in 2035)",
      value: roundSmallValues(Math.round(total_demand)),
      displayValue: roundSmallValues(Math.round(total_demand)),
      isFinalProjection: true,
      base: 0,
      xValue: 5
    }
  ];
};

export const calculateWaterfallMinimum = (selectedData: WorkforceMetrics): number => {
  // Get all three datasets
  const supplyData = processLeftData(getSupplyData(selectedData));
  const demandData = processRightData(getDemandData(selectedData));
  const gapData = getGapData(selectedData);

  const findMinPoint = (data: ChartData[]): number => {
    return Math.min(
      ...data.map(item => {
        const base = item.base || 0;
        const value = item.value || 0;
        
        // For positive values, we only need to check the base
        // For negative values, we need to check base + value
        return value >= 0 ? base : base + value;
      })
    );
  };

  // Calculate minimum point for each chart
  const supplyMin = findMinPoint(supplyData);
  const demandMin = findMinPoint(demandData);
  const gapMin = findMinPoint(gapData);

  // Return the lowest value among all three charts
  return Math.min(supplyMin, demandMin, gapMin);
};