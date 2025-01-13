import type { ModelResults, JobNameLookup, ModelResult } from '../types/results';

export class DataLoader {
  private static instance: DataLoader;
  private jobNameLookup: JobNameLookup = {};
  private results: ModelResults = {};
  private initialized = false;

  private constructor() {}

  static getInstance(): DataLoader {
    if (!DataLoader.instance) {
      DataLoader.instance = new DataLoader();
    }
    return DataLoader.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      const basePath = import.meta.env.BASE_URL;
      // Try gzipped files first
      try {
        const [resultsResponse, lookupResponse] = await Promise.all([
          fetch(`${basePath}data/model-results.json.gz`, {
            headers: {
              'Accept-Encoding': 'gzip',
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${basePath}data/job-names.json.gz`, {
            headers: {
              'Accept-Encoding': 'gzip',
              'Content-Type': 'application/json'
            }
          })
        ]);

        // If both gzipped files are found, use them
        if (resultsResponse.ok && lookupResponse.ok) {
          this.results = await resultsResponse.json();
          this.jobNameLookup = await lookupResponse.json();
          this.initialized = true;
          return;
        }
      } catch (error) {
        console.warn('Gzipped files not available, falling back to uncompressed');
      }

      // Fallback to uncompressed files
      const [resultsResponse, lookupResponse] = await Promise.all([
        fetch(`${basePath}data/model-results.json`),
        fetch(`${basePath}data/job-names.json`)
      ]);

      this.results = await resultsResponse.json();
      this.jobNameLookup = await lookupResponse.json();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to load data:', error);
      throw error;
    }
  }

  getResultForSettings(settingsKey: string): ModelResult | null {
    if (!this.initialized) {
      throw new Error('DataLoader not initialized');
    }
    return this.results[settingsKey] || null;
  }

  // Helper method to convert IDs to names in the results
  transformResult(result: ModelResult): {
    remainingShortages: Array<{ jobName: string; shortage: number }>;
    topTransitions: Array<{ sourceJob: string; targetJob: string; amount: number }>;
  } {
    return {
      remainingShortages: result.remainingShortages.map(shortage => ({
        jobName: this.jobNameLookup[shortage.jobId],
        shortage: shortage.shortage
      })),
      topTransitions: result.topTransitions.map(transition => ({
        sourceJob: this.jobNameLookup[transition.sourceJobId],
        targetJob: this.jobNameLookup[transition.targetJobId],
        amount: transition.amount
      }))
    };
  }
}