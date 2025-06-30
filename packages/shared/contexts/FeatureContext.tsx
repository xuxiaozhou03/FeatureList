import React, { createContext, useContext, type ReactNode } from "react";
import type { FeatureConfig, VersionConfig } from "../../versions/feature";

interface FeatureContextType {
  features: Record<string, FeatureConfig>;
  isEnabled: (featureId: string) => boolean;
  getFeatureConfig: (featureId: string) => FeatureConfig | undefined;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const FeatureProvider: React.FC<{
  config: VersionConfig;
  children: ReactNode;
}> = ({ config, children }) => {
  const features = config.features.reduce((acc, feature) => {
    acc[feature.id] = feature;
    return acc;
  }, {} as Record<string, FeatureConfig>);

  const isEnabled = (featureId: string): boolean => {
    const feature = features[featureId];
    return feature?.enabled ?? false;
  };

  const getFeatureConfig = (featureId: string): FeatureConfig | undefined => {
    return features[featureId];
  };

  return (
    <FeatureContext.Provider value={{ features, isEnabled, getFeatureConfig }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatureContext = (): FeatureContextType => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatureContext must be used within a FeatureProvider");
  }
  return context;
};
