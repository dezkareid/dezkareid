export interface ExperimentMetadata {
  title: string;
  description: string;
  slug: string;
  webApis: string[];
  status: 'experimental' | 'stable' | 'deprecated';
  publishedDate: string;
  featured?: boolean;
  order?: number;
}
