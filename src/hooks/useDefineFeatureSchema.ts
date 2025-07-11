import featureConfigSchema from "../schema/feature-config.schema.json";
import { useLocalStorageState } from "ahooks";

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

  return {
    schemaStr,
    setSchemaStr,
    featureConfigSchema,
    features,
  };
};
export default useDefineFeatureSchema;
