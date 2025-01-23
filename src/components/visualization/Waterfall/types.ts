import type { WorkforceMetrics } from '@/types/results';

export interface ChartData {
    name: string;
    value: number;
    displayValue: number;
    xValue: number;
    base?: number;
    total?: number;
    uniqueId?: string;
    isFinalProjection?: boolean;
    isExcessWorkers?: boolean;
    isShortage?: boolean;
    isShortageReduction?: boolean;
    footnote?: string;
    footnoteNumber?: number;
  }
  
  export interface ChartComponentProps {
    data: ChartData[];
    title: string;
    subtitle: string;
    showAxis?: boolean;
    orientation?: "left" | "right";
    isGapChart?: boolean;
    domain: [number, number];
  }
  
  export interface DualWaterfallProps {
    data: { [key: string]: WorkforceMetrics };
    className?: string;
  }

  export interface FootnoteEntry {
    number: number;
    text: string;
  }