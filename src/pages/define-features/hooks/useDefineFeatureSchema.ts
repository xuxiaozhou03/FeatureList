import featureConfigSchema from "../schema/feature-config.schema.json";
import { useLocalStorageState } from "ahooks";

const useDefineFeatureSchema = () => {
  const [data, setData] = useLocalStorageState("define-feature-schema", {
    defaultValue: JSON.stringify(featureConfigSchema.example, null, 2),
  });

  return {
    data,
    setData,
    featureConfigSchema,
  };
};
export default useDefineFeatureSchema;
