import { useMemo } from "react";
import featureConfigSchema from "../schema/feature-config.schema.json";
import { useLocalStorageState } from "ahooks";
import { generateVersionFeatureListSchema } from "@/schema/version-feature-list.schema";
import { getVersionDefaultConfig } from "@/schema/getVersionDefaultConfig";
import getTypeDefinitions from "@/schema/getTypeDefinitions";

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

  const typeDefinitions = useMemo(() => {
    return getTypeDefinitions(versionSchema);
  }, [versionSchema]);

  return {
    schemaStr,
    setSchemaStr,
    featureConfigSchema,
    features,
    versionSchema,
    defaultVersionConfig,
    typeDefinitions,
  };
};
export default useDefineFeatureSchema;
