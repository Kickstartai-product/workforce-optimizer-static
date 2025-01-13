export interface Setting {
    id: string;
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
  }
  
  export interface VisualizationConfig {
    settings: Setting[];
    // Add more configuration options as needed
  }