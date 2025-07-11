import { useMemo } from "react";
import featureConfigSchema from "../schema/feature-config.schema.json";
import { useLocalStorageState } from "ahooks";
import { generateVersionFeatureListSchema } from "@/schema/version-feature-list.schema";

const getParams = (paramsConfig: any) => {
  return Object.entries(paramsConfig || {}).reduce((acc, [key, param]) => {
    const { type, defaultValue } = param as any;

    let value = defaultValue;
    if (defaultValue === undefined) {
      // 尝试从类型中获取值
    }

    acc[key] = value;
    return acc;
  }, {} as any);
};
const getFeatures = (features: any) => {
  return Object.entries(features).reduce((acc, [key, node]) => {
    const { title, description, params, type, ...children } = node as any;

    acc[key] = {
      enabled: true,
      params: getParams(params),
      ...getFeatures(children),
    };

    return acc;
  }, {} as any);
};

const getVersionDefaultConfig = (features: any) => {
  const defaultVersionConfig = {
    name: "enterprise",
    description: "企业版功能清单",
    features: getFeatures(features),
  };
  return defaultVersionConfig;
};

const useDefineFeatureSchema = () => {
  const [schemaStr, setSchemaStr] = useLocalStorageState(
    "define-feature-schema",
    {
      defaultValue: JSON.stringify(featureConfigSchema.example, null, 2),
    }
  );
  let features: any = {};
  try {
    features = JSON.parse(schemaStr || "{}") || {};
  } catch {
    features = {};
  }

  const versionSchema = useMemo(
    () => generateVersionFeatureListSchema(features),
    [features]
  );
  const defaultVersionConfig = useMemo(
    () => getVersionDefaultConfig(features),
    [features]
  );

  return {
    schemaStr,
    setSchemaStr,
    featureConfigSchema,
    features,
    versionSchema,
    defaultVersionConfig,
  };
};
export default useDefineFeatureSchema;
