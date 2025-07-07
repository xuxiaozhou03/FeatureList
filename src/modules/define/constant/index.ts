import featureSchema from "./feature.schema.json";

// 对于功能清单配置的约束
export const FEATURE_SCHEMA = featureSchema;
export type FeatureSchema = typeof featureSchema;

export const FEATURE_SCHEMA_EXAMPLE = featureSchema.example;
