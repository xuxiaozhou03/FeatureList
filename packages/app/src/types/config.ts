export interface FeatureConfig {
  enabled: boolean;
  params: Record<string, any>;
  children?: Record<string, FeatureConfig>;
}

export interface AppConfig {
  version: "community" | "enterprise" | "professional";
  features: {
    dashboard: FeatureConfig;
    projects: FeatureConfig;
    issues: FeatureConfig;
    code: FeatureConfig;
  };
}

export type VersionType = "community" | "enterprise" | "professional";
