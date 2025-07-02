import { useConfig } from "./useConfig";
import type { FeatureConfig } from "../types/config";

export function useFeatures() {
  const { config, loading, error } = useConfig();

  const isFeatureEnabled = (featurePath: string): boolean => {
    if (!config) return false;

    const paths = featurePath.split(".");
    let current: any = config.features;

    for (const path of paths) {
      current = current?.[path];
      if (!current) return false;
    }

    return current.enabled === true;
  };

  const getFeatureParams = (featurePath: string): any => {
    if (!config) return {};

    const paths = featurePath.split(".");
    let current: any = config.features;

    for (const path of paths) {
      current = current?.[path];
      if (!current) return {};
    }

    return current.params || {};
  };

  const getFeatureConfig = (featurePath: string): FeatureConfig | null => {
    if (!config) return null;

    const paths = featurePath.split(".");
    let current: any = config.features;

    for (const path of paths) {
      current = current?.[path];
      if (!current) return null;
    }

    return current;
  };

  return {
    features: config?.features || {},
    isFeatureEnabled,
    getFeatureParams,
    getFeatureConfig,
    loading,
    error,
    // 便捷访问器
    dashboard: config?.features.dashboard,
    projects: config?.features.projects,
    issues: config?.features.issues,
    code: config?.features.code,
  };
}
