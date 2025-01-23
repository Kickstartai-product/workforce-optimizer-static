import type { ChartData } from './types';
import type { WorkforceMetrics } from '@/types/results';

export const formatNumber = (value: number): string => {
  if (value === 0) return "0";
  if (Math.abs(value) === 0) return value < 0 ? "-0" : "0";

  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return `${value < 0 ? '-' : ''}${(absValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    return `${value < 0 ? '-' : ''}${(absValue / 1000).toFixed(0)}K`;
  }
  return `${value < 0 ? '-' : ''}${absValue.toLocaleString()}`;
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
    total += item.value;
    return {
      ...item,
      base,
      total,
      uniqueId: `left-${index}`
    };
  });
};

export const processRightData = (data: ChartData[]): ChartData[] => {
  let total = data.reduce((sum, item) => sum + item.value, 0);
  return data.map((item, index) => {
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
      value: Math.round(selectedData.labor_supply),
      displayValue: Math.round(selectedData.labor_supply),
      xValue: 1
    },
    {
      name: "Instroom minus uitstroom (tot 2035)",
      value: Math.round(selectedData.net_labor_change),
      displayValue: Math.round(selectedData.net_labor_change),
      xValue: 2
    }
  ];
};

export const getDemandData = (selectedData: WorkforceMetrics): ChartData[] => {
  return [
    {
      name: "geprojecteerde groei door productiviteit",
      value: Math.round(selectedData.productivity),
      displayValue: Math.round(selectedData.productivity),
      xValue: 1
    },
    {
      name: "Uitbreidsvraag",
      value: Math.round(selectedData.expansion_demand),
      displayValue: Math.round(selectedData.expansion_demand),
      xValue: 2
    },
    {
      name: "inkrimpingsvraag",
      value: Math.round(selectedData.reduction_demand),
      displayValue: Math.round(selectedData.reduction_demand),
      xValue: 3
    },
    {
      name: "Vacatures boven 2% frictie",
      value: Math.round(selectedData.vacancies),
      displayValue: Math.round(selectedData.vacancies),
      xValue: 4,
      footnote: "We gaan ervanuit dat er altijd 2% frictiewerkloosheid zal zijn. We rekenen daarom alleen vacatures boven de 2% mee.",
      footnoteNumber: 2
    },
    {
      name: "Ingevulde arbeidsvraag (2024)",
      value: Math.round(selectedData.labor_supply),
      displayValue: Math.round(selectedData.labor_supply),
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
      value: Math.round(total_supply),
      displayValue: Math.round(total_supply),
      isFinalProjection: true,
      base: 0,
      xValue: 1
    },
    {
      name: "Overtollig geraakt (tussen 2024 en 2035)",
      value: Math.round(superfluous_with_transitions) * -1,
      displayValue: Math.round(superfluous_with_transitions) * -1,
      isExcessWorkers: true,
      base: Math.round(total_supply),
      xValue: 2,
      footnote: "Een medewerker is overtollig als het niet lukt om een passende transitie te maken naar een nieuwe baan, terwijl de huidige baan niet meer  is benodigd vanwege productiviteitsstijging of sturing op afbouw van deze activiteit.",
      footnoteNumber: 1,
    },
    {
      name: "Van baan gewisseld (tussen 2024 en 2035)",
      value: Math.round(selectedData.transitions_in),
      displayValue: Math.round(selectedData.transitions_in),
      isShortageReduction: true,
      base: total_supply - superfluous_with_transitions,
      xValue: 3
    },
    {
      name: "Resterend tekort (in 2035)",
      value: Math.round(selectedData.shortage),
      displayValue: Math.round(selectedData.shortage),
      isShortage: true,
      base: total_supply - superfluous_with_transitions + selectedData.transitions_in,
      xValue: 4
    },
    {
      name: "Arbeidsvraag (in 2035)",
      value: Math.round(total_demand),
      displayValue: Math.round(total_demand),
      isFinalProjection: true,
      base: 0,
      xValue: 5
    }
  ];
};