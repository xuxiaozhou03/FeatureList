import enterprise from "../../auto-generate/enterprise.json";
import community from "../../auto-generate/community.json";
import { useLocalStorageState } from "ahooks";
import schema from "./feature.schema.json";
import VersionConfig from "../../auto-generate";
import { useState } from "react";

export interface VersionItem extends VersionConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
}
export const useVersions = () => {
  return useLocalStorageState<VersionItem[]>("version-list", [
    enterprise,
    community,
  ] as VersionItem[]);
};

export const useFeatureSchema = () => {
  return useLocalStorageState(
    "feature-schema",
    JSON.stringify(schema.example, null, 2)
  );
};

export const useFeatures = () => {
  const [version, setVersion] = useState(
    () => (globalThis as any).__VERSION__ || "enterprise"
  );
  const [versions] = useVersions();

  const versionConfig = versions.find((v) => v.name === version) || versions[0];
  const features = versionConfig.features || {};
  const isEnterprise = versionConfig.name === "enterprise";
  const isCommunity = versionConfig.name === "community";
  const isProfessional = !isEnterprise && !isCommunity;

  return {
    version,
    setVersion,
    versionConfig,
    features,
    isEnterprise,
    isCommunity,
    isProfessional,
  };
};

export const useFeatureEnabled = (featurePath: string) => {
  const { features } = useFeatures();

  // 支持嵌套路径，如 "projects.pipelines"
  const checkFeature = (obj: any, path: string): boolean => {
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (!current || typeof current !== "object") return false;
      current = current[key];
    }

    return current?.enabled === true;
  };

  return checkFeature(features, featurePath);
};

export const useFeatureParams = (featurePath: string) => {
  const { features } = useFeatures();

  // 支持嵌套路径获取参数
  const getFeatureParams = (obj: any, path: string): any => {
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (!current || typeof current !== "object") return {};
      current = current[key];
    }

    return current?.params || {};
  };

  return getFeatureParams(features, featurePath);
};
