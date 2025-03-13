export interface SentimentResult {
    overall_sentiment: 'positive' | 'negative' | 'neutral';
    emotions: {
      type: string;
      intensity: number;
      keywords: { word: string; count: number }[];
    }[];
  }