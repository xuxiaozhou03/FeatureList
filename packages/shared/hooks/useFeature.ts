import { useFeatureContext } from "../contexts/FeatureContext";
import type { FeatureConfig } from "../../versions/feature";

export const useFeature = (featureId: string): boolean => {
  const { isEnabled } = useFeatureContext();
  return isEnabled(featureId);
};

export const useFeatureConfig = <T = unknown>(
  featureId: string
): T | undefined => {
  const { getFeatureConfig } = useFeatureContext();
  const feature = getFeatureConfig(featureId);
  return feature?.config as T;
};

// 条件性Hook - 只有功能启用时才执行
export const useConditionalFeature = <T>(
  featureId: string,
  hook: () => T,
  fallback?: T
): T | undefined => {
  const isEnabled = useFeature(featureId);
  if (isEnabled) {
    return hook();
  }
  return fallback;
};

// 类型安全的useFeature Hook
export const useTypedFeature = <T extends FeatureConfig>(
  featureId: T["id"]
): boolean => {
  return useFeature(featureId);
};
