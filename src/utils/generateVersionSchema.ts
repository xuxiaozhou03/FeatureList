import type { FeatureJson, DefineFeature } from "../hooks/useFeatureJson";

function convertConfig(
  config?: Record<
    string,
    {
      name: string;
      type: string;
      description: string;
      default?: string | number | boolean;
      required?: boolean;
      enum?: Array<string | number>;
      enumDesc?: string[];
    }
  >
) {
  if (!config) return undefined;
  return {
    type: "object",
    properties: Object.fromEntries(
      Object.entries(config).map(([key, value]) => [
        key,
        {
          type: value.type,
          name: value.name,
          description: value.description,
          default: value.default,
          enum: value.enum,
          enumDesc: value.enumDesc,
          required: value.required,
        },
      ])
    ),
  };
}

function convertFeature(feature: DefineFeature): Record<string, unknown> {
  const result: Record<string, unknown> = {
    type: "object",
    name: feature.name,
    description: feature.description,
    properties: {
      enabled: {
        type: "boolean",
        name: `启用${feature.name}`,
        description: `是否启用${feature.name}功能`,
      },
    },
  };
  if (feature.config) {
    (result.properties as Record<string, unknown>)["config"] = convertConfig(
      feature.config
    );
  }
  // 递归处理子功能项
  Object.entries(feature)
    .filter(
      ([key, value]) =>
        typeof value === "object" &&
        value !== null &&
        key !== "config" &&
        key !== "name" &&
        key !== "description"
    )
    .forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        "name" in value &&
        "description" in value
      ) {
        (result.properties as Record<string, unknown>)[key] = convertFeature(
          value as DefineFeature
        );
      }
    });
  return result;
}

export function generateVersionSchema(json: FeatureJson) {
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "英文版本名称，如：enterprise, community",
      },
      description: {
        type: "string",
        description: "版本说明或备注信息",
      },
      features: {
        type: "object",
        properties: Object.fromEntries(
          Object.entries(json).map(([key, value]) => [
            key,
            convertFeature(value),
          ])
        ),
      },
    },
  };
}
