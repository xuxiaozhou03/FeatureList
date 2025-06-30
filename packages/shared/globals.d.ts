declare global {
  const __VERSION__: string;
  const __FEATURE_CONFIG__: import("../versions/feature").FeatureConfig[];
  const __ENABLED_FEATURES__: string[];
}

export {};
